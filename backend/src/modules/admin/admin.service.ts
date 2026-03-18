import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getDashboard() {
    const cacheKey = 'admin:dashboard';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const [
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      pendingOrders,
      recentOrders,
      lowStockItems,
      newUsersToday,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'COMPLETED' },
      }),
      this.prisma.order.count(),
      this.prisma.user.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      this.getlowStockItems(),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // Monthly revenue for chart
    const monthlyRevenue = await this.getMonthlyRevenue();

    const dashboard = {
      stats: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalOrders,
        totalUsers,
        totalProducts,
        pendingOrders,
        newUsersToday,
      },
      recentOrders,
      lowStockItems,
      monthlyRevenue,
    };

    await this.redis.set(cacheKey, dashboard, 300); // 5 min cache
    return dashboard;
  }

  private async getlowStockItems() {
    const items = await this.prisma.inventory.findMany({
      include: {
        product: { select: { id: true, name: true, slug: true, images: true } },
      },
    });
    return items.filter((i) => i.stock <= i.lowStockThreshold).slice(0, 10);
  }

  private async getMonthlyRevenue() {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const revenue = await this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: { id: true },
        where: {
          createdAt: { gte: start, lte: end },
          paymentStatus: 'COMPLETED',
        },
      });

      months.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: revenue._sum.totalAmount || 0,
        orders: revenue._count.id || 0,
      });
    }

    return months;
  }

  async getActivityLog(params: { page?: number; pageSize?: number; email?: string; eventType?: string }) {
    const { page = 1, pageSize = 10, email, eventType } = params;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (eventType && eventType !== 'all') where.eventType = eventType;
    if (email) {
      const user = await this.prisma.user.findFirst({ where: { email: { contains: email, mode: 'insensitive' } }, select: { id: true } });
      if (user) where.userId = user.id;
      else return { logs: [], total: 0 };
    }

    const [logs, total] = await Promise.all([
      this.prisma.userActivityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        include: { user: { select: { email: true } } },
      }),
      this.prisma.userActivityLog.count({ where }),
    ]);

    return { logs, total };
  }

  async checkSetup() {
    const adminCount = await this.prisma.user.count({ where: { role: 'ADMIN' } });
    return { hasAdmin: adminCount > 0 };
  }

  async createFirstAdmin(email: string, password: string) {
    const adminCount = await this.prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount > 0) {
      return { error: 'Admin already exists' };
    }
    const bcrypt = await import('bcrypt');
    const hashed = await bcrypt.hash(password, 12);
    const admin = await this.prisma.user.create({
      data: { email, password: hashed, role: 'ADMIN' },
    });
    return { success: true, userId: admin.id };
  }

  async weeklySummary() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [loginCount, newOrderCount, totalRevenueAgg, newUsers, roleChanges] = await Promise.all([
      this.prisma.userActivityLog.count({ where: { eventType: 'login', createdAt: { gte: weekAgo } } }),
      this.prisma.order.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: weekAgo }, paymentStatus: 'COMPLETED' } }),
      this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.userActivityLog.count({ where: { eventType: 'role_change', createdAt: { gte: weekAgo } } }),
    ]);

    const admins = await this.prisma.user.findMany({ where: { role: 'ADMIN' }, select: { email: true } });

    return {
      metrics: {
        loginCount,
        newOrderCount,
        totalRevenue: totalRevenueAgg._sum.totalAmount || 0,
        newUsers,
        roleChanges,
        activeUsers: loginCount,
      },
      results: admins.map((a) => ({ email: a.email, success: true })),
    };
  }

  async getAdminReviews(params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status && status !== 'all') where.verified = status === 'approved';

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          product: { select: { name: true, images: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { reviews, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateReviewStatus(id: string, verified: boolean) {
    const review = await this.prisma.review.update({ where: { id }, data: { verified } });
    // Invalidate product cache so storefront reflects updated review status
    await this.redis.invalidatePattern('products:*');
    return review;
  }

  // PromoCode CRUD
  async getPromoCodes() {
    return this.prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createPromoCode(data: any) {
    return this.prisma.promoCode.create({ data });
  }

  async updatePromoCode(id: string, data: any) {
    return this.prisma.promoCode.update({ where: { id }, data });
  }

  async deletePromoCode(id: string) {
    return this.prisma.promoCode.delete({ where: { id } });
  }

  async validatePromoCode(code: string, orderTotal: number) {
    const promo = await this.prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
    if (!promo) return { valid: false, error: 'Invalid promo code' };
    if (!promo.isActive) return { valid: false, error: 'This promo code is inactive' };
    if (promo.endDate && promo.endDate < new Date()) return { valid: false, error: 'This promo code has expired' };
    if (promo.minOrderValue && orderTotal < promo.minOrderValue) return { valid: false, error: `Minimum order of ₹${promo.minOrderValue} required` };
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) return { valid: false, error: 'Promo code usage limit reached' };

    const discount = promo.discountType === 'percentage'
      ? orderTotal * (promo.discountValue / 100)
      : Math.min(promo.discountValue, orderTotal);

    return { valid: true, promoCode: promo, discount };
  }

  // ── Featured Products ────────────────────────────────────────────────

  async getFeaturedProducts() {
    return this.prisma.featuredProduct.findMany({
      orderBy: { position: 'asc' },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
            inventory: { select: { stock: true, reservedStock: true } },
          },
        },
      },
    });
  }

  async getPublicFeaturedProducts() {
    const cacheKey = 'featured-products:public';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const featured = await this.prisma.featuredProduct.findMany({
      where: { isActive: true, product: { isActive: true, isHidden: false } },
      orderBy: { position: 'asc' },
      take: 12,
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
            inventory: { select: { stock: true, reservedStock: true } },
            reviews: { select: { rating: true } },
          },
        },
      },
    });

    const products = featured.map((f) => {
      const p = f.product;
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;
      const { reviews, ...rest } = p;
      return { ...rest, avgRating, reviewCount: reviews.length };
    });

    await this.redis.set(cacheKey, products, 600); // 10 min cache
    return products;
  }

  async addFeaturedProduct(productId: string, position?: number) {
    const featured = await this.prisma.featuredProduct.create({
      data: { productId, position: position ?? 0 },
      include: { product: true },
    });
    await this.redis.invalidatePattern('featured-products:*');
    return featured;
  }

  async updateFeaturedProduct(id: string, data: { position?: number; isActive?: boolean }) {
    const featured = await this.prisma.featuredProduct.update({
      where: { id },
      data,
      include: { product: true },
    });
    await this.redis.invalidatePattern('featured-products:*');
    return featured;
  }

  async removeFeaturedProduct(id: string) {
    await this.prisma.featuredProduct.delete({ where: { id } });
    await this.redis.invalidatePattern('featured-products:*');
    return { message: 'Featured product removed' };
  }
}

