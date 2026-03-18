import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Controller()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get('health')
  async check() {
    const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

    // Database health
    const dbStart = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = { status: 'healthy', latency: Date.now() - dbStart };
    } catch (err: any) {
      checks.database = { status: 'unhealthy', error: err.message };
    }

    // Redis health
    const redisStart = Date.now();
    try {
      await this.redis.set('health:ping', 'pong', 10);
      const val = await this.redis.get<string>('health:ping');
      checks.redis = {
        status: val === 'pong' ? 'healthy' : 'degraded',
        latency: Date.now() - redisStart,
      };
    } catch {
      checks.redis = { status: 'degraded', latency: Date.now() - redisStart };
    }

    const overall = Object.values(checks).every((c) => c.status === 'healthy')
      ? 'healthy'
      : Object.values(checks).some((c) => c.status === 'unhealthy')
        ? 'unhealthy'
        : 'degraded';

    return {
      status: overall,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    };
  }

  @Get('metrics')
  async metrics() {
    const mem = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    // Order throughput (last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let orderThroughput24h = 0;
    let inventoryUpdates24h = 0;
    try {
      orderThroughput24h = await this.prisma.order.count({
        where: { createdAt: { gte: oneDayAgo } },
      });
      inventoryUpdates24h = await this.prisma.inventory.count();
    } catch {
      // Graceful fallback
    }

    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: Math.round(mem.rss / 1024 / 1024) + ' MB',
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + ' MB',
        external: Math.round(mem.external / 1024 / 1024) + ' MB',
      },
      cpu: {
        user: Math.round(cpuUsage.user / 1000) + ' ms',
        system: Math.round(cpuUsage.system / 1000) + ' ms',
      },
      pid: process.pid,
      nodeVersion: process.version,
      throughput: {
        orders24h: orderThroughput24h,
        inventoryRecords: inventoryUpdates24h,
      },
    };
  }
}

