import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrderProcessor } from '../order-processing/order.processor';
import { EmailProcessor } from './email.processor';
import { InventoryProcessor } from '../inventory/inventory.processor';
import { InventoryAlertProcessor } from '../inventory-alert/inventory-alert.processor';
import { SearchIndexProcessor } from '../search-index/search-index.processor';
import { EmailCampaignProcessor } from '../email-campaigns/email-campaign.processor';
import { InventoryModule } from '../../modules/inventory/inventory.module';
import { SearchIndexModule } from '../../modules/search-index/search-index.module';

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 5000,
  },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 500 },
};

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'order-processing', defaultJobOptions },
      { name: 'email-notifications', defaultJobOptions },
      { name: 'inventory-update', defaultJobOptions },
      { name: 'inventory-alert', defaultJobOptions },
      { name: 'search-index-update', defaultJobOptions },
      { name: 'email-campaigns', defaultJobOptions },
      { name: 'order-dlq' },
      { name: 'email-dlq' },
      { name: 'inventory-alert-dlq' },
      { name: 'search-index-dlq' },
      { name: 'email-campaign-dlq' },
    ),
    InventoryModule,
    SearchIndexModule,
  ],
  providers: [
    OrderProcessor,
    EmailProcessor,
    InventoryProcessor,
    InventoryAlertProcessor,
    SearchIndexProcessor,
    EmailCampaignProcessor,
  ],
  exports: [BullModule],
})
export class NotificationsModule {}

