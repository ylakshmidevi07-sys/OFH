import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { BannerPlacement } from '@prisma/client';

@Injectable()
export class BannersService {
  private readonly logger = new Logger(BannersService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll() {
    return this.prisma.banner.findMany({
      orderBy: [{ placement: 'asc' }, { position: 'asc' }],
    });
  }

  async getPublicBanners(placement?: string) {
    const cacheKey = `banners:public:${placement || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const where: any = {
      isActive: true,
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } },
      ],
    };
    if (placement) where.placement = placement as BannerPlacement;

    const banners = await this.prisma.banner.findMany({
      where,
      orderBy: { position: 'asc' },
    });

    await this.redis.set(cacheKey, banners, 600);
    return banners;
  }

  async create(dto: CreateBannerDto) {
    const banner = await this.prisma.banner.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
    await this.invalidateCache();
    this.logger.log(`Banner created: ${banner.title}`);
    return banner;
  }

  async update(id: string, dto: UpdateBannerDto) {
    const existing = await this.prisma.banner.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Banner not found');

    const banner = await this.prisma.banner.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
    await this.invalidateCache();
    return banner;
  }

  async delete(id: string) {
    const existing = await this.prisma.banner.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Banner not found');

    await this.prisma.banner.delete({ where: { id } });
    await this.invalidateCache();
    return { message: 'Banner deleted' };
  }

  private async invalidateCache() {
    await this.redis.invalidatePattern('banners:*');
  }
}

