import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { EmailCampaignsService } from './email-campaigns.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateEmailCampaignDto, UpdateEmailCampaignDto } from './dto/email-campaign.dto';

@Controller('admin/email-campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class EmailCampaignsController {
  constructor(private readonly emailCampaignsService: EmailCampaignsService) {}

  @Get()
  async findAll() {
    return this.emailCampaignsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.emailCampaignsService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateEmailCampaignDto) {
    return this.emailCampaignsService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmailCampaignDto) {
    return this.emailCampaignsService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.emailCampaignsService.delete(id);
  }

  @Post(':id/send')
  async send(@Param('id') id: string) {
    return this.emailCampaignsService.send(id);
  }
}

