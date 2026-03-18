import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreatePricingRuleDto, UpdatePricingRuleDto } from './dto/pricing-rule.dto';
import { PricingTargetType } from '@prisma/client';

@Injectable()
export class PricingRulesService {
  private readonly logger = new Logger(PricingRulesService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll() {
    return this.prisma.pricingRule.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        product: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    });
  }

  async create(dto: CreatePricingRuleDto) {
    const data: any = {
      name: dto.name,
      type: dto.type,
      targetType: dto.targetType,
      value: dto.value,
      minQuantity: dto.minQuantity,
      priority: dto.priority ?? 0,
      isActive: dto.isActive ?? true,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };

    // Link to product or category based on targetType
    if (dto.targetType === PricingTargetType.PRODUCT && dto.targetId) {
      data.productId = dto.targetId;
    } else if (dto.targetType === PricingTargetType.CATEGORY && dto.targetId) {
      data.categoryId = dto.targetId;
    }
    data.targetId = dto.targetId;

    const rule = await this.prisma.pricingRule.create({ data });
    await this.invalidateCache();
    this.logger.log(`Pricing rule created: ${rule.name}`);
    return rule;
  }

  async update(id: string, dto: UpdatePricingRuleDto) {
    const existing = await this.prisma.pricingRule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Pricing rule not found');

    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    if (dto.targetType === PricingTargetType.PRODUCT && dto.targetId) {
      data.productId = dto.targetId;
      data.categoryId = null;
    } else if (dto.targetType === PricingTargetType.CATEGORY && dto.targetId) {
      data.categoryId = dto.targetId;
      data.productId = null;
    }

    const rule = await this.prisma.pricingRule.update({ where: { id }, data });
    await this.invalidateCache();
    return rule;
  }

  async delete(id: string) {
    const existing = await this.prisma.pricingRule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Pricing rule not found');

    await this.prisma.pricingRule.delete({ where: { id } });
    await this.invalidateCache();
    return { message: 'Pricing rule deleted' };
  }

  /**
   * Calculate dynamic price for a product (used during checkout).
   * Returns the best discount from active rules.
   */
  async calculatePrice(productId: string, categoryId: string, originalPrice: number, quantity: number = 1): Promise<{ finalPrice: number; discount: number; appliedRule?: string }> {
    const now = new Date();

    const rules = await this.prisma.pricingRule.findMany({
      where: {
        isActive: true,
        OR: [
          { targetType: PricingTargetType.PRODUCT, productId },
          { targetType: PricingTargetType.CATEGORY, categoryId },
          { targetType: PricingTargetType.CART },
        ],
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        ],
      },
      orderBy: { priority: 'desc' },
    });

    if (rules.length === 0) {
      return { finalPrice: originalPrice, discount: 0 };
    }

    // Apply highest-priority rule
    const rule = rules[0];
    let discount = 0;

    switch (rule.type) {
      case 'PERCENTAGE':
        discount = originalPrice * (rule.value / 100);
        break;
      case 'FIXED':
        discount = Math.min(rule.value, originalPrice);
        break;
      case 'TIERED':
        if (rule.minQuantity && quantity >= rule.minQuantity) {
          discount = originalPrice * (rule.value / 100);
        }
        break;
    }

    return {
      finalPrice: Math.round((originalPrice - discount) * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      appliedRule: rule.name,
    };
  }

  private async invalidateCache() {
    await this.redis.invalidatePattern('pricing-rules:*');
    await this.redis.invalidatePattern('products:*');
  }
}

