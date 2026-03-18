import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private readonly CACHE_PREFIX = 'categories';

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll() {
    const cacheKey = `${this.CACHE_PREFIX}:all`;
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached) return cached;

    const categories = await this.prisma.category.findMany({
      include: {
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });

    await this.redis.set(cacheKey, categories, 3600);
    return categories;
  }

  async findBySlug(slug: string) {
    const cacheKey = `${this.CACHE_PREFIX}:${slug}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        products: { where: { isActive: true }, take: 20 },
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    await this.redis.set(cacheKey, category, 3600);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.generateSlug(dto.name);
    const category = await this.prisma.category.create({
      data: { ...dto, slug },
    });
    await this.invalidateCache();
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    const updateData: any = { ...dto };
    if (dto.name) updateData.slug = this.generateSlug(dto.name);

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateData,
    });
    await this.invalidateCache();
    return updated;
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    await this.prisma.category.delete({ where: { id } });
    await this.invalidateCache();
    return { message: 'Category deleted' };
  }

  private async invalidateCache() {
    await this.redis.invalidatePattern(`${this.CACHE_PREFIX}:*`);
    await this.redis.invalidatePattern('products:*');
    await this.redis.del('admin:dashboard');
    this.logger.debug('Category cache invalidated (including products)');
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

