import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Processor('email-notifications')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    @InjectQueue('email-dlq') private readonly dlq: Queue,
  ) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`Processing email job: ${job.name} (attempt ${job.attemptsMade + 1})`);

    try {
      switch (job.name) {
        case 'order-confirmation':
          await this.sendOrderConfirmation(job.data);
          break;
        case 'order-status-update':
          await this.sendOrderStatusUpdate(job.data);
          break;
        case 'welcome-email':
          await this.sendWelcomeEmail(job.data);
          break;
        case 'low-stock-notification':
          await this.sendLowStockNotification(job.data);
          break;
        case 'out-of-stock-notification':
          await this.sendOutOfStockNotification(job.data);
          break;
        default:
          this.logger.warn(`Unknown email job: ${job.name}`);
      }
    } catch (error: any) {
      this.logger.error(
        `Email job failed: ${job.name} — ${error.message}`,
        error.stack,
      );

      // If this is the last attempt, move to DLQ
      if (job.attemptsMade >= (job.opts?.attempts ?? 3) - 1) {
        this.logger.error(`Moving email job ${job.name} to dead-letter queue after ${job.attemptsMade + 1} attempts`);
        await this.dlq.add('failed-email', {
          originalJob: job.name,
          data: job.data,
          error: error.message,
          failedAt: new Date().toISOString(),
          attempts: job.attemptsMade + 1,
        });
      }

      throw error; // re-throw to let BullMQ handle retry
    }
  }

  private async sendOrderConfirmation(data: any) {
    // Stub: integrate with SendGrid/SES/Nodemailer
    this.logger.log(
      `📧 Sending order confirmation email for order ${data.orderNumber} to user ${data.userId}`,
    );
  }

  private async sendOrderStatusUpdate(data: any) {
    this.logger.log(
      `📧 Sending status update email: Order ${data.orderId} is now ${data.status}`,
    );
  }

  private async sendWelcomeEmail(data: any) {
    this.logger.log(`📧 Sending welcome email to user ${data.userId}`);
  }

  private async sendLowStockNotification(data: any) {
    this.logger.log(
      `📧 Low stock alert to ${data.email}: "${data.productName}" has ${data.stock} units (threshold: ${data.threshold})`,
    );
  }

  private async sendOutOfStockNotification(data: any) {
    this.logger.log(
      `📧 Out of stock alert to ${data.email}: "${data.productName}" is out of stock`,
    );
  }
}

