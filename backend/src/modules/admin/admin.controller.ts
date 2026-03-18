import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('activity-log')
  async getActivityLog(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('email') email?: string,
    @Query('eventType') eventType?: string,
  ) {
    return this.adminService.getActivityLog({
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
      email,
      eventType,
    });
  }

  @Public()
  @Get('setup')
  async checkSetup() {
    return this.adminService.checkSetup();
  }

  @Public()
  @Post('setup')
  async createFirstAdmin(@Body() body: { email: string; password: string }) {
    return this.adminService.createFirstAdmin(body.email, body.password);
  }

  @Post('weekly-summary')
  async weeklySummary() {
    return this.adminService.weeklySummary();
  }

  @Get('reviews')
  async getReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAdminReviews({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }

  @Patch('reviews/:id')
  async updateReview(@Param('id') id: string, @Body() body: { verified: boolean }) {
    return this.adminService.updateReviewStatus(id, body.verified);
  }

  @Get('promo-codes')
  async getPromoCodes() {
    return this.adminService.getPromoCodes();
  }

  @Post('promo-codes')
  async createPromoCode(@Body() body: any) {
    return this.adminService.createPromoCode(body);
  }

  @Patch('promo-codes/:id')
  async updatePromoCode(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updatePromoCode(id, body);
  }

  @Delete('promo-codes/:id')
  async deletePromoCode(@Param('id') id: string) {
    return this.adminService.deletePromoCode(id);
  }

  // ── Featured Products (Admin CRUD) ──────────────────────────────────

  @Get('featured-products')
  async getFeaturedProducts() {
    return this.adminService.getFeaturedProducts();
  }

  @Post('featured-products')
  async addFeaturedProduct(@Body() body: { productId: string; position?: number }) {
    return this.adminService.addFeaturedProduct(body.productId, body.position);
  }

  @Patch('featured-products/:id')
  async updateFeaturedProduct(@Param('id') id: string, @Body() body: { position?: number; isActive?: boolean }) {
    return this.adminService.updateFeaturedProduct(id, body);
  }

  @Delete('featured-products/:id')
  async removeFeaturedProduct(@Param('id') id: string) {
    return this.adminService.removeFeaturedProduct(id);
  }
}

// Separate public controller for storefront-facing featured products
@Controller('featured-products')
export class FeaturedProductsPublicController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getPublicFeaturedProducts() {
    return this.adminService.getPublicFeaturedProducts();
  }
}
