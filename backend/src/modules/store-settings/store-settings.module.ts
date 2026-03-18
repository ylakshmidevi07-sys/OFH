import { Module } from '@nestjs/common';
import { StoreSettingsAdminController, StoreSettingsPublicController } from './store-settings.controller';
import { StoreSettingsService } from './store-settings.service';

@Module({
  controllers: [StoreSettingsAdminController, StoreSettingsPublicController],
  providers: [StoreSettingsService],
  exports: [StoreSettingsService],
})
export class StoreSettingsModule {}

