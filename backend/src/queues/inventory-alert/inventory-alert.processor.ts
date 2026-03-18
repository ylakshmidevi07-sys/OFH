import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('inventory-alert')
export class InventoryAlertProcessor extends WorkerHost {
  private readonly logger = new Logger(InventoryAlertProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('email-notifications') private readonly emailQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<{ productId: string; stock: number; threshold: number; productName: string }>) {
    this.logger.log(`Processing inventory alert: ${job.name} for product ${job.data.productId}`);

    try {
      switch (job.name) {
        case 'low-stock-alert':
          await this.handleLowStockAlert(job.data);
          break;
        case 'out-of-stock-alert':
          await this.handleOutOfStockAlert(job.data);
          break;
        default:
          this.logger.warn(`Unknown inventory alert job: ${job.name}`);
      }
    } catch (error: any) {
      this.logger.error(`Inventory alert failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async handleLowStockAlert(data: { productId: string; stock: number; threshold: number; productName: string }) {
    this.logger.warn(
      `⚠️ LOW STOCK ALERT: "${data.productName}" — stock: ${data.stock}, threshold: ${data.threshold}`,
    );

    // Notify admins via email queue
    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true },
    });

    for (const admin of admins) {
      await this.emailQueue.add('low-stock-notification', {
        userId: admin.id,
        email: admin.email,
        productName: data.productName,
        stock: data.stock,
        threshold: data.threshold,
      });
    }
  }

  private async handleOutOfStockAlert(data: { productId: string; stock: number; productName: string }) {
    this.logger.error(`🚨 OUT OF STOCK: "${data.productName}"`);

    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true },
    });

    for (const admin of admins) {
      await this.emailQueue.add('out-of-stock-notification', {
        userId: admin.id,
        email: admin.email,
        productName: data.productName,
      });
    }
  }
}

