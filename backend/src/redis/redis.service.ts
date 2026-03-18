import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);
  private readonly defaultTTL = 3600; // 1 hour
  private isConnected = false;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      retryStrategy: (times) => {
        if (times > 5) {
          this.logger.warn('Redis unavailable – running without cache');
          return null; // stop retrying
        }
        return Math.min(times * 200, 2000);
      },
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      this.logger.log('Redis connected');
    });
    this.client.on('error', (err: any) => {
      this.isConnected = false;
      this.logger.error('Redis error', { code: err.code || err.message });
    });
    this.client.on('close', () => {
      this.isConnected = false;
    });

    // Attempt connection but don't crash if Redis is down
    this.client.connect().catch(() => {
      this.logger.warn('Redis not available – caching disabled');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    if (!this.isConnected) return;
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      await this.client.set(key, serialized, 'EX', ttl || this.defaultTTL);
    } catch {
      // silently skip if Redis unavailable
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) return;
    try {
      await this.client.del(key);
    } catch {}
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.isConnected) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
        this.logger.debug(`Invalidated ${keys.length} cache keys matching ${pattern}`);
      }
    } catch {}
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.client.quit();
    }
  }
}

