import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  Optional,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { UpdateInventoryDto } from './dto/inventory.dto';

const INVENTORY_CACHE_KEY = 'inventory:all';
const INVENTORY_CACHE_TTL = 300; // 5 minutes

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    @Optional() @InjectQueue('inventory-alert') private readonly alertQueue?: Queue,
  ) {}

  async findAll() {
    // Try cache first
    const cached = await this.redis.get<any[]>(INVENTORY_CACHE_KEY);
    if (cached) {
      this.logger.debug('Inventory cache hit');
      return cached;
    }

    const data = await this.prisma.inventory.findMany({
      include: {
        product: { select: { id: true, name: true, slug: true, price: true, images: true } },
      },
      orderBy: { stock: 'asc' },
    });

    await this.redis.set(INVENTORY_CACHE_KEY, data, INVENTORY_CACHE_TTL);
    return data;
  }

  async findLowStock() {
    return this.prisma.inventory.findMany({
      where: {
        stock: { lte: this.prisma.inventory.fields?.lowStockThreshold as any },
      },
      include: {
        product: { select: { id: true, name: true, slug: true, price: true } },
      },
    });
  }

  async getLowStockItems() {
    // Raw query approach for comparing columns
    const items = await this.prisma.inventory.findMany({
      include: {
        product: { select: { id: true, name: true, slug: true, price: true, images: true } },
      },
    });
    return items.filter((i) => i.stock <= i.lowStockThreshold);
  }

  async update(productId: string, dto: UpdateInventoryDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) throw new NotFoundException('Inventory record not found');

    const result = await this.prisma.inventory.update({
      where: { productId },
      data: dto,
      include: {
        product: { select: { id: true, name: true } },
      },
    });

    await this.redis.del(INVENTORY_CACHE_KEY);
    await this.redis.invalidatePattern('products:*');
    await this.redis.del('admin:dashboard');

    // Check for low stock / out of stock alerts
    await this.checkStockAlerts(result);

    return result;
  }

  private async checkStockAlerts(inventory: any) {
    if (!this.alertQueue) return;

    const productName = inventory.product?.name || 'Unknown';

    if (inventory.stock <= 0) {
      await this.alertQueue.add('out-of-stock-alert', {
        productId: inventory.productId || inventory.id,
        stock: inventory.stock,
        productName,
      });
    } else if (inventory.stock <= inventory.lowStockThreshold) {
      await this.alertQueue.add('low-stock-alert', {
        productId: inventory.productId || inventory.id,
        stock: inventory.stock,
        threshold: inventory.lowStockThreshold,
        productName,
      });
    }
  }

  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) return false;
    return inventory.stock - inventory.reservedStock >= quantity;
  }

  async reserveStock(productId: string, quantity: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) throw new NotFoundException('Inventory not found');

    const availableStock = inventory.stock - inventory.reservedStock;
    if (availableStock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product. Available: ${availableStock}, Requested: ${quantity}`,
      );
    }

    const result = await this.prisma.inventory.update({
      where: { productId },
      data: { reservedStock: { increment: quantity } },
    });

    await this.redis.del(INVENTORY_CACHE_KEY);
    return result;
  }

  async releaseStock(productId: string, quantity: number) {
    const result = await this.prisma.inventory.update({
      where: { productId },
      data: { reservedStock: { decrement: quantity } },
    });
    await this.redis.del(INVENTORY_CACHE_KEY);
    return result;
  }

  async confirmStockDeduction(productId: string, quantity: number) {
    const result = await this.prisma.inventory.update({
      where: { productId },
      data: {
        stock: { decrement: quantity },
        reservedStock: { decrement: quantity },
      },
    });
    await this.redis.del(INVENTORY_CACHE_KEY);
    return result;
  }
}

