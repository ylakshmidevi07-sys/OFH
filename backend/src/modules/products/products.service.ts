import { Injectable, NotFoundException, Logger, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly CACHE_PREFIX = 'products';

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    @Optional() @InjectQueue('search-index-update') private readonly searchQueue?: Queue,
  ) {}

  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      categoryId,
      minPrice,
      maxPrice,
      isNew,
    } = query;

    const cacheKey = `${this.CACHE_PREFIX}:list:${JSON.stringify(query)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = { isActive: true, isHidden: false };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (isNew !== undefined) where.isNew = isNew;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          inventory: { select: { stock: true, reservedStock: true } },
          reviews: { select: { rating: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const productsWithRating = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;
      const { reviews, ...rest } = p;
      return { ...rest, avgRating, reviewCount: reviews.length };
    });

    const result = {
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.redis.set(cacheKey, result, 600); // 10 min cache
    return result;
  }

  async findBySlug(slug: string) {
    const cacheKey = `${this.CACHE_PREFIX}:${slug}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        inventory: true,
        reviews: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    const result = { ...product, avgRating, reviewCount: product.reviews.length };
    await this.redis.set(cacheKey, result, 1800);
    return result;
  }

  async create(dto: CreateProductDto) {
    const slug = this.generateSlug(dto.name);
    const { stock, ...productData } = dto;

    const product = await this.prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: { ...productData, slug },
      });

      await tx.inventory.create({
        data: {
          productId: created.id,
          stock: stock || 0,
        },
      });

      return created;
    });

    await this.invalidateCache();
    this.logger.log(`Product created: ${product.name}`);
    await this.enqueueSearchIndex('reindex-product', product.id);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const { stock, ...productData } = dto;
    const updateData: any = { ...productData };
    if (dto.name) updateData.slug = this.generateSlug(dto.name);

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: updateData,
        include: { inventory: true },
      });

      if (stock !== undefined) {
        await tx.inventory.upsert({
          where: { productId: id },
          update: { stock },
          create: { productId: id, stock },
        });
      }

      return updatedProduct;
    });

    await this.invalidateCache();
    await this.enqueueSearchIndex('reindex-product', id);
    return updated;
  }

  async delete(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    await this.prisma.product.delete({ where: { id } });
    await this.invalidateCache();
    await this.enqueueSearchIndex('remove-product', id);
    return { message: 'Product deleted' };
  }

  private async invalidateCache() {
    await this.redis.invalidatePattern(`${this.CACHE_PREFIX}:*`);
    await this.redis.del('admin:dashboard');
    await this.redis.invalidatePattern('featured-products:*');
    await this.redis.invalidatePattern('categories:*');
    this.logger.debug('Product cache invalidated (including admin dashboard, featured, categories)');
  }

  private async enqueueSearchIndex(action: string, productId: string) {
    if (!this.searchQueue) return;
    try {
      await this.searchQueue.add(action, { productId, action });
    } catch {
      this.logger.warn(`Failed to enqueue search index job: ${action} for ${productId}`);
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

