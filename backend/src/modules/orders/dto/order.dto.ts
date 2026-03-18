import { IsString, IsOptional, IsNumber, IsObject, Min } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsObject()
  shippingAddress?: Record<string, any>;

  @IsOptional()
  @IsString()
  promoCode?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  status: string;
}

export class OrderQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

