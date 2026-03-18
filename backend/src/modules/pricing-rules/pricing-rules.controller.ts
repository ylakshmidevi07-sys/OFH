import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PricingRulesService } from './pricing-rules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreatePricingRuleDto, UpdatePricingRuleDto } from './dto/pricing-rule.dto';

@Controller('admin/pricing-rules')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class PricingRulesController {
  constructor(private readonly pricingRulesService: PricingRulesService) {}

  @Get()
  async findAll() {
    return this.pricingRulesService.findAll();
  }

  @Post()
  async create(@Body() dto: CreatePricingRuleDto) {
    return this.pricingRulesService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePricingRuleDto) {
    return this.pricingRulesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.pricingRulesService.delete(id);
  }
}

