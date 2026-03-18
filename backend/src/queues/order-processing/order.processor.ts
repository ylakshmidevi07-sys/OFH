import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Processor('order-processing')
export class OrderProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(
    @InjectQueue('order-dlq') private readonly dlq: Queue,
  ) {
    super();
  }

  async process(job: Job<{ orderId: string; userId: string }>) {
    this.logger.log(`Processing order: ${job.data.orderId} (attempt ${job.attemptsMade + 1})`);

    try {
      switch (job.name) {
        case 'process-order':
          await this.processOrder(job.data);
          break;
        default:
          this.logger.warn(`Unknown job name: ${job.name}`);
      }
    } catch (error: any) {
      this.logger.error(
        `Order processing failed: ${job.data.orderId} — ${error.message}`,
        error.stack,
      );

      // If this is the last attempt, move to DLQ
      if (job.attemptsMade >= (job.opts?.attempts ?? 3) - 1) {
        this.logger.error(`Moving order ${job.data.orderId} to dead-letter queue after ${job.attemptsMade + 1} attempts`);
        await this.dlq.add('failed-order', {
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

  private async processOrder(data: { orderId: string; userId: string }) {
    this.logger.log(`Order ${data.orderId} - Validating payment...`);
    await this.delay(1000);

    this.logger.log(`Order ${data.orderId} - Preparing for fulfillment...`);
    await this.delay(500);

    this.logger.log(`Order ${data.orderId} - Processing complete`);
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

