import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    return user;
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: string, dto: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = {};
    if (dto.role) updateData.role = dto.role as Role;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
  }

  async blockUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(userId: string, data: any) {
    const existingCount = await this.prisma.address.count({ where: { userId } });
    return this.prisma.address.create({
      data: { ...data, userId, isDefault: existingCount === 0 },
    });
  }

  async updateAddress(userId: string, addressId: string, data: any) {
    return this.prisma.address.updateMany({
      where: { id: addressId, userId },
      data,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    return this.prisma.address.deleteMany({ where: { id: addressId, userId } });
  }

  async getPaymentMethods(userId: string) {
    return this.prisma.savedPaymentMethod.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createPaymentMethod(userId: string, data: any) {
    const existingCount = await this.prisma.savedPaymentMethod.count({ where: { userId } });
    return this.prisma.savedPaymentMethod.create({
      data: { ...data, userId, isDefault: existingCount === 0 },
    });
  }

  async deletePaymentMethod(userId: string, methodId: string) {
    return this.prisma.savedPaymentMethod.deleteMany({ where: { id: methodId, userId } });
  }
}

