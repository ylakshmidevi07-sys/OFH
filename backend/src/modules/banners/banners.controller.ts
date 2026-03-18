import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';

@Controller('admin/banners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class BannersAdminController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  async findAll() {
    return this.bannersService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateBannerDto) {
    return this.bannersService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.bannersService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bannersService.delete(id);
  }
}

@Controller('banners')
export class BannersPublicController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  async getPublicBanners(@Query('placement') placement?: string) {
    return this.bannersService.getPublicBanners(placement);
  }
}

