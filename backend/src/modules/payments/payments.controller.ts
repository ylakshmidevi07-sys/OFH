import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto);
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  async getByOrderId(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrderId(orderId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.paymentsService.updatePaymentStatus(id, dto);
  }

  @Post('webhook')
  async webhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}

