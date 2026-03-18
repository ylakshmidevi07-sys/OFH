import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {}

  async createPayment(dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) throw new NotFoundException('Order not found');

    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId: dto.orderId },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this order');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        paymentProvider: dto.paymentProvider,
        transactionId: dto.transactionId,
        amount: dto.amount,
        paymentStatus: PaymentStatus.PENDING,
      },
    });

    this.logger.log(`Payment created for order ${order.orderNumber}`);
    return payment;
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: {
          select: { orderNumber: true, totalAmount: true, status: true },
        },
      },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async updatePaymentStatus(paymentId: string, dto: UpdatePaymentStatusDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: dto.paymentStatus as PaymentStatus,
        transactionId: dto.transactionId || payment.transactionId,
      },
    });

    // Update order payment status
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: dto.paymentStatus as PaymentStatus },
    });

    this.logger.log(
      `Payment ${paymentId} status updated to ${dto.paymentStatus}`,
    );
    return updated;
  }

  async handleWebhook(payload: any) {
    // Stub for payment gateway webhook handling
    this.logger.log(`Webhook received: ${JSON.stringify(payload)}`);
    // Implement specific gateway logic (Stripe/Razorpay) here
    return { received: true };
  }
}

