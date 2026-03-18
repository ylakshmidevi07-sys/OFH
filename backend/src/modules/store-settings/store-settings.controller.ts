import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { StoreSettingsService } from './store-settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateStoreSettingsDto } from './dto/store-settings.dto';

@Controller('admin/store-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class StoreSettingsAdminController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  @Get()
  async getSettings() {
    return this.storeSettingsService.getSettings();
  }

  @Patch()
  async updateSettings(@Body() dto: UpdateStoreSettingsDto) {
    return this.storeSettingsService.updateSettings(dto);
  }
}

@Controller('store-settings')
export class StoreSettingsPublicController {
  constructor(private readonly storeSettingsService: StoreSettingsService) {}

  @Get()
  async getPublicSettings() {
    return this.storeSettingsService.getSettings();
  }
}

