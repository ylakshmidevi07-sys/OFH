import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { AdminService } from '../admin/admin.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly adminService: AdminService,
  ) {}

  @Post('validate-promo')
  @HttpCode(HttpStatus.OK)
  async validatePromo(@Body() body: { code: string; orderTotal: number }) {
    return this.adminService.validatePromoCode(body.code, body.orderTotal);
  }

  @Get('track/:orderNumber')
  async trackOrder(
    @Param('orderNumber') orderNumber: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.ordersService.findByOrderNumber(orderNumber, role === 'ADMIN' ? undefined : userId);
  }

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(userId, dto);
  }

  @Get()
  async findUserOrders(
    @CurrentUser('id') userId: string,
    @Query() query: OrderQueryDto,
  ) {
    return this.ordersService.findUserOrders(userId, query);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findAllAdmin(@Query() query: OrderQueryDto) {
    return this.ordersService.findAllAdmin(query);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.ordersService.findById(id, role === 'ADMIN' ? undefined : userId);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Patch(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.ordersService.cancelOrder(id, userId);
  }
}


