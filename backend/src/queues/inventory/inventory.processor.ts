import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { InventoryService } from '../../modules/inventory/inventory.service';

@Processor('inventory-update')
export class InventoryProcessor extends WorkerHost {
  private readonly logger = new Logger(InventoryProcessor.name);

  constructor(private readonly inventoryService: InventoryService) {
    super();
  }

  async process(job: Job<{ productId: string; stock?: number; lowStockThreshold?: number }>) {
    this.logger.log(
      `Processing inventory update: product ${job.data.productId} (attempt ${job.attemptsMade + 1})`,
    );

    try {
      switch (job.name) {
        case 'stock-update': {
          const { productId, ...payload } = job.data;
          await this.inventoryService.update(productId, payload);
          this.logger.log(`Inventory updated for product ${productId}`);
          break;
        }
        default:
          this.logger.warn(`Unknown inventory job: ${job.name}`);
      }
    } catch (error: any) {
      this.logger.error(
        `Inventory update failed: ${job.data.productId} — ${error.message}`,
        error.stack,
      );
      throw error; // re-throw so BullMQ can retry
    }
  }
}

