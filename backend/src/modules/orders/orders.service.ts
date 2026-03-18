import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Optional,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { PricingRulesService } from '../pricing-rules/pricing-rules.service';
import { StoreSettingsService } from '../store-settings/store-settings.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto } from './dto/order.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    @InjectQueue('order-processing') private readonly orderQueue: Queue,
    @InjectQueue('email-notifications') private readonly emailQueue: Queue,
    @Optional() private readonly pricingRulesService?: PricingRulesService,
    @Optional() private readonly storeSettingsService?: StoreSettingsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { inventory: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.product.inventory) {
        const available =
          item.product.inventory.stock - item.product.inventory.reservedStock;
        if (available < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${item.product.name}. Available: ${available}`,
          );
        }
      }
    }

    // Calculate totals with dynamic pricing rules
    let subtotal = 0;
    let totalPricingDiscount = 0;
    for (const item of cart.items) {
      let itemPrice = item.product.price;
      if (this.pricingRulesService) {
        try {
          const priced = await this.pricingRulesService.calculatePrice(
            item.productId,
            item.product.categoryId || '',
            item.product.price,
            item.quantity,
          );
          itemPrice = priced.finalPrice;
          totalPricingDiscount += priced.discount * item.quantity;
        } catch {
          // Fallback to original price if pricing rules fail
        }
      }
      subtotal += itemPrice * item.quantity;
    }

    // Load store settings for shipping/tax (fallback to defaults)
    let shippingBaseCost = 50;
    let freeShippingMin = 500;
    let taxRate = 5;
    if (this.storeSettingsService) {
      try {
        const settings: any = await this.storeSettingsService.getSettings();
        if (settings) {
          shippingBaseCost = settings.shippingBaseCost ?? 50;
          freeShippingMin = settings.freeShippingMin ?? 500;
          taxRate = settings.taxRate ?? 5;
        }
      } catch {
        // Fallback to defaults
      }
    }

    const shipping = subtotal > freeShippingMin ? 0 : shippingBaseCost;
    const tax = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    const discount = totalPricingDiscount;
    const totalAmount = subtotal + shipping + tax;

    // Generate order number
    const orderNumber = `OFH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create order in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Reserve stock
      for (const item of cart.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: { reservedStock: { increment: item.quantity } },
        });
      }

      // Create order
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          subtotal,
          shipping,
          tax,
          discount,
          totalAmount,
          shippingAddress: dto.shippingAddress || {},
          promoCode: dto.promoCode,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              unit: item.product.unit,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    // Enqueue background jobs via BullMQ
    await this.orderQueue.add('process-order', { orderId: order.id, userId });
    await this.emailQueue.add('order-confirmation', { orderNumber: order.orderNumber, userId });

    this.logger.log(`Order created: ${order.orderNumber}`);
    await this.invalidateAdminCache();
    return order;
  }

  async findUserOrders(userId: string, query: OrderQueryDto) {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) where.status = status as OrderStatus;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { name: true, images: true, slug: true } },
            },
          },
          payment: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: { include: { product: true } },
        payment: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status as OrderStatus },
      include: { items: true },
    });

    // If delivered, confirm stock deduction
    if (dto.status === OrderStatus.DELIVERED) {
      for (const item of updated.items) {
        await this.prisma.inventory.update({
          where: { productId: item.productId },
          data: {
            stock: { decrement: item.quantity },
            reservedStock: { decrement: item.quantity },
          },
        });
      }
    }

    // If cancelled, release reserved stock
    if (dto.status === OrderStatus.CANCELLED) {
      for (const item of updated.items) {
        await this.prisma.inventory.update({
          where: { productId: item.productId },
          data: { reservedStock: { decrement: item.quantity } },
        });
      }
    }

    // Enqueue status-update notification
    await this.emailQueue.add('order-status-update', { orderId: order.id, status: dto.status });

    await this.invalidateAdminCache();
    return updated;
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    // Release reserved stock
    for (const item of order.items) {
      await this.prisma.inventory.update({
        where: { productId: item.productId },
        data: { reservedStock: { decrement: item.quantity } },
      });
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async findAllAdmin(query: OrderQueryDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status as OrderStatus;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          items: { include: { product: { select: { name: true } } } },
          payment: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByOrderNumber(orderNumber: string, userId?: string) {
    const where: any = { orderNumber };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true, unit: true },
            },
          },
        },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        payment: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private async invalidateAdminCache() {
    await this.redis.del('admin:dashboard');
    await this.redis.invalidatePattern('inventory:*');
    this.logger.debug('Admin dashboard + inventory cache invalidated');
  }
}

