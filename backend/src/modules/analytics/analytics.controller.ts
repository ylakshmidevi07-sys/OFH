import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  async getSalesAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getSalesAnalytics(startDate, endDate);
  }

  @Get('top-products')
  async getTopProducts(@Query('limit') limit?: number) {
    return this.analyticsService.getTopProducts(limit || 10);
  }

  @Get('customers')
  async getCustomerAnalytics() {
    return this.analyticsService.getCustomerAnalytics();
  }

  @Get('revenue')
  async getRevenueBreakdown(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getRevenueBreakdown(startDate, endDate);
  }

  @Get('products')
  async getProductAnalytics() {
    return this.analyticsService.getProductAnalytics();
  }

  @Get('conversion-rate')
  async getConversionRate() {
    return this.analyticsService.getConversionRate();
  }
}

