import { Module } from '@nestjs/common';
import { HomepageAdminController, HomepagePublicController } from './homepage.controller';
import { HomepageService } from './homepage.service';

@Module({
  controllers: [HomepageAdminController, HomepagePublicController],
  providers: [HomepageService],
  exports: [HomepageService],
})
export class HomepageModule {}

