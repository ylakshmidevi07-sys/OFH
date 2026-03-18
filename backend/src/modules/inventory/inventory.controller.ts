import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/inventory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async findAll() {
    return this.inventoryService.findAll();
  }

  @Get('low-stock')
  async getLowStock() {
    return this.inventoryService.getLowStockItems();
  }

  @Patch(':productId')
  async update(
    @Param('productId') productId: string,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(productId, dto);
  }
}

