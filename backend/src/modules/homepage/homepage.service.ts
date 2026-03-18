import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateHomepageSectionDto, UpdateHomepageSectionDto } from './dto/homepage-section.dto';

@Injectable()
export class HomepageService {
  private readonly logger = new Logger(HomepageService.name);
  private readonly CACHE_KEY = 'homepage:layout';

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll() {
    return this.prisma.homepageSection.findMany({
      orderBy: { position: 'asc' },
    });
  }

  async getPublicLayout() {
    const cached = await this.redis.get(this.CACHE_KEY);
    if (cached) return cached;

    const sections = await this.prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });

    await this.redis.set(this.CACHE_KEY, sections, 600);
    return sections;
  }

  async create(dto: CreateHomepageSectionDto) {
    const section = await this.prisma.homepageSection.create({ data: dto });
    await this.invalidateCache();
    this.logger.log(`Homepage section created: ${section.type} at position ${section.position}`);
    return section;
  }

  async update(id: string, dto: UpdateHomepageSectionDto) {
    const existing = await this.prisma.homepageSection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Homepage section not found');

    const section = await this.prisma.homepageSection.update({
      where: { id },
      data: dto,
    });
    await this.invalidateCache();
    return section;
  }

  async delete(id: string) {
    const existing = await this.prisma.homepageSection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Homepage section not found');

    await this.prisma.homepageSection.delete({ where: { id } });
    await this.invalidateCache();
    return { message: 'Section deleted' };
  }

  async reorder(orderedIds: string[]) {
    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.homepageSection.update({
          where: { id },
          data: { position: index },
        }),
      ),
    );
    await this.invalidateCache();
    return { message: 'Sections reordered' };
  }

  private async invalidateCache() {
    await this.redis.del(this.CACHE_KEY);
  }
}

