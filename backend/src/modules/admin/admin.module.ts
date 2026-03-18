import { Module } from '@nestjs/common';
import { AdminController, FeaturedProductsPublicController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController, FeaturedProductsPublicController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

