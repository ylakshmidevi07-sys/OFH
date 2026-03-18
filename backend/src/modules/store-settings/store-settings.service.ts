import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { UpdateStoreSettingsDto } from './dto/store-settings.dto';

@Injectable()
export class StoreSettingsService {
  private readonly logger = new Logger(StoreSettingsService.name);
  private readonly CACHE_KEY = 'store-settings';

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * Get or create the singleton store settings record.
   */
  async getSettings() {
    const cached = await this.redis.get(this.CACHE_KEY);
    if (cached) return cached;

    let settings = await this.prisma.storeSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.storeSettings.create({ data: {} });
      this.logger.log('Default store settings created');
    }

    await this.redis.set(this.CACHE_KEY, settings, 3600); // 1h cache
    return settings;
  }

  async updateSettings(dto: UpdateStoreSettingsDto) {
    let settings = await this.prisma.storeSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.storeSettings.create({ data: dto });
    } else {
      settings = await this.prisma.storeSettings.update({
        where: { id: settings.id },
        data: dto,
      });
    }

    await this.redis.del(this.CACHE_KEY);
    this.logger.log('Store settings updated');
    return settings;
  }
}

