import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getSalesAnalytics(startDate?: string, endDate?: string) {
    const cacheKey = `analytics:sales:${startDate || 'all'}:${endDate || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [totalSales, ordersByStatus, dailySales] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: { id: true },
        _avg: { totalAmount: true },
        where: { ...where, paymentStatus: 'COMPLETED' },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
        where,
      }),
      this.getDailySales(startDate, endDate),
    ]);

    const result = {
      totalRevenue: totalSales._sum.totalAmount || 0,
      totalOrders: totalSales._count.id || 0,
      averageOrderValue: Math.round((totalSales._avg.totalAmount || 0) * 100) / 100,
      ordersByStatus: ordersByStatus.map((s) => ({
        status: s.status,
        count: s._count.id,
      })),
      dailySales,
    };

    await this.redis.set(cacheKey, result, 900); // 15 min cache
    return result;
  }

  async getTopProducts(limit: number = 10) {
    const cacheKey = `analytics:top-products:${limit}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, price: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const productIds = topProducts.map((p) => p.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, slug: true, images: true, price: true },
    });

    const result = topProducts.map((tp) => {
      const product = products.find((p) => p.id === tp.productId);
      return {
        product,
        totalQuantitySold: tp._sum.quantity || 0,
        totalRevenue: tp._sum.price || 0,
        orderCount: tp._count.id || 0,
      };
    });

    await this.redis.set(cacheKey, result, 900);
    return result;
  }

  async getCustomerAnalytics() {
    const cacheKey = 'analytics:customers';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const [totalCustomers, newCustomersThisMonth, topCustomers] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'USER' } }),
        this.prisma.user.count({
          where: {
            role: 'USER',
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
        this.prisma.order.groupBy({
          by: ['userId'],
          _sum: { totalAmount: true },
          _count: { id: true },
          orderBy: { _sum: { totalAmount: 'desc' } },
          take: 10,
        }),
      ]);

    const userIds = topCustomers.map((c) => c.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    const result = {
      totalCustomers,
      newCustomersThisMonth,
      topCustomers: topCustomers.map((tc) => {
        const user = users.find((u) => u.id === tc.userId);
        return {
          user,
          totalSpent: tc._sum.totalAmount || 0,
          orderCount: tc._count.id || 0,
        };
      }),
    };

    await this.redis.set(cacheKey, result, 900);
    return result;
  }

  private async getDailySales(startDate?: string, endDate?: string) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        paymentStatus: 'COMPLETED',
      },
      select: { createdAt: true, totalAmount: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    for (const order of orders) {
      const day = order.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(day) || { revenue: 0, orders: 0 };
      dailyMap.set(day, {
        revenue: existing.revenue + order.totalAmount,
        orders: existing.orders + 1,
      });
    }

    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));
  }

  async getRevenueBreakdown(startDate?: string, endDate?: string) {
    const cacheKey = `analytics:revenue:${startDate || 'all'}:${endDate || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = { paymentStatus: 'COMPLETED' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [revenueByCategory, revenueByMonth, avgOrderValue] = await Promise.all([
      this.getRevenueByCategory(where),
      this.getRevenueByMonth(where),
      this.prisma.order.aggregate({
        _avg: { totalAmount: true },
        _sum: { totalAmount: true, tax: true, shipping: true, discount: true },
        _count: { id: true },
        where,
      }),
    ]);

    const result = {
      revenueByCategory,
      revenueByMonth,
      summary: {
        totalRevenue: avgOrderValue._sum.totalAmount || 0,
        totalTax: avgOrderValue._sum.tax || 0,
        totalShipping: avgOrderValue._sum.shipping || 0,
        totalDiscount: avgOrderValue._sum.discount || 0,
        averageOrderValue: Math.round((avgOrderValue._avg.totalAmount || 0) * 100) / 100,
        totalOrders: avgOrderValue._count.id,
      },
    };

    await this.redis.set(cacheKey, result, 900);
    return result;
  }

  async getProductAnalytics() {
    const cacheKey = 'analytics:products';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const [totalProducts, activeProducts, hiddenProducts, outOfStockCount, categoryCounts] =
      await Promise.all([
        this.prisma.product.count(),
        this.prisma.product.count({ where: { isActive: true, isHidden: false } }),
        this.prisma.product.count({ where: { isHidden: true } }),
        this.prisma.inventory.count({ where: { stock: { lte: 0 } } }),
        this.prisma.product.groupBy({
          by: ['categoryId'],
          _count: { id: true },
          where: { isActive: true },
        }),
      ]);

    const categoryIds = categoryCounts.map((c) => c.categoryId);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const result = {
      totalProducts,
      activeProducts,
      hiddenProducts,
      outOfStockCount,
      productsByCategory: categoryCounts.map((c) => ({
        category: categories.find((cat) => cat.id === c.categoryId)?.name || 'Unknown',
        count: c._count.id,
      })),
    };

    await this.redis.set(cacheKey, result, 900);
    return result;
  }

  async getConversionRate() {
    const cacheKey = 'analytics:conversion';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsers, usersWithOrders, totalCarts, completedOrders, cancelledOrders] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'USER' } }),
        this.prisma.order.groupBy({
          by: ['userId'],
          _count: { id: true },
          where: { createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.cart.count({
          where: { items: { some: {} } },
        }),
        this.prisma.order.count({
          where: { paymentStatus: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.order.count({
          where: { status: 'CANCELLED', createdAt: { gte: thirtyDaysAgo } },
        }),
      ]);

    const result = {
      totalRegisteredUsers: totalUsers,
      activeCustomers30d: usersWithOrders.length,
      activeCarts: totalCarts,
      completedOrders30d: completedOrders,
      cancelledOrders30d: cancelledOrders,
      cartToOrderRate: totalCarts > 0
        ? Math.round((completedOrders / totalCarts) * 100 * 100) / 100
        : 0,
      userToCustomerRate: totalUsers > 0
        ? Math.round((usersWithOrders.length / totalUsers) * 100 * 100) / 100
        : 0,
    };

    await this.redis.set(cacheKey, result, 900);
    return result;
  }

  private async getRevenueByCategory(orderWhere: any) {
    const orders = await this.prisma.order.findMany({
      where: orderWhere,
      select: {
        items: {
          select: {
            price: true,
            quantity: true,
            product: { select: { categoryId: true } },
          },
        },
      },
    });

    const categoryMap = new Map<string, number>();
    for (const order of orders) {
      for (const item of order.items) {
        const catId = item.product?.categoryId || 'unknown';
        const revenue = item.price * item.quantity;
        categoryMap.set(catId, (categoryMap.get(catId) || 0) + revenue);
      }
    }

    const categoryIds = Array.from(categoryMap.keys());
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    return Array.from(categoryMap.entries()).map(([catId, revenue]) => ({
      category: categories.find((c) => c.id === catId)?.name || 'Unknown',
      revenue: Math.round(revenue * 100) / 100,
    }));
  }

  private async getRevenueByMonth(orderWhere: any) {
    const orders = await this.prisma.order.findMany({
      where: orderWhere,
      select: { createdAt: true, totalAmount: true },
      orderBy: { createdAt: 'asc' },
    });

    const monthMap = new Map<string, { revenue: number; count: number }>();
    for (const order of orders) {
      const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthMap.get(key) || { revenue: 0, count: 0 };
      monthMap.set(key, {
        revenue: existing.revenue + order.totalAmount,
        count: existing.count + 1,
      });
    }

    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.count,
    }));
  }
}

