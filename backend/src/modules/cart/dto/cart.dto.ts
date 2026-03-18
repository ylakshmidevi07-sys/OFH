import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number = 1;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}

