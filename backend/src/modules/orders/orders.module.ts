import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AdminModule } from '../admin/admin.module';
import { PricingRulesModule } from '../pricing-rules/pricing-rules.module';
import { StoreSettingsModule } from '../store-settings/store-settings.module';
import { NotificationsModule } from '../../queues/notifications/notifications.module';

@Module({
  imports: [AdminModule, PricingRulesModule, StoreSettingsModule, NotificationsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

