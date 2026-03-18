import { Module } from '@nestjs/common';
import { BannersAdminController, BannersPublicController } from './banners.controller';
import { BannersService } from './banners.service';

@Module({
  controllers: [BannersAdminController, BannersPublicController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}

