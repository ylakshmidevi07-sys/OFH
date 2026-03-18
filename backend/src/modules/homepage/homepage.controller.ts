import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateHomepageSectionDto, UpdateHomepageSectionDto } from './dto/homepage-section.dto';

@Controller('admin/homepage-sections')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class HomepageAdminController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  async findAll() {
    return this.homepageService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateHomepageSectionDto) {
    return this.homepageService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateHomepageSectionDto) {
    return this.homepageService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.homepageService.delete(id);
  }

  @Post('reorder')
  async reorder(@Body() body: { orderedIds: string[] }) {
    return this.homepageService.reorder(body.orderedIds);
  }
}

@Controller('homepage-layout')
export class HomepagePublicController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  async getLayout() {
    return this.homepageService.getPublicLayout();
  }
}

