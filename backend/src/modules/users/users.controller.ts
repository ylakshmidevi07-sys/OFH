import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  // Addresses
  @Get('addresses')
  async getAddresses(@CurrentUser('id') userId: string) {
    return this.usersService.getAddresses(userId);
  }

  @Post('addresses')
  async createAddress(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.usersService.createAddress(userId, body);
  }

  @Patch('addresses/:id')
  async updateAddress(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.usersService.updateAddress(userId, id, body);
  }

  @Delete('addresses/:id')
  async deleteAddress(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.deleteAddress(userId, id);
  }

  // Payment Methods
  @Get('payment-methods')
  async getPaymentMethods(@CurrentUser('id') userId: string) {
    return this.usersService.getPaymentMethods(userId);
  }

  @Post('payment-methods')
  async createPaymentMethod(
    @CurrentUser('id') userId: string,
    @Body() body: any,
  ) {
    return this.usersService.createPaymentMethod(userId, body);
  }

  @Delete('payment-methods/:id')
  async deletePaymentMethod(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.deletePaymentMethod(userId, id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRole(id, dto);
  }

  @Patch(':id/block')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async blockUser(@Param('id') id: string) {
    return this.usersService.blockUser(id);
  }
}

