import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateInventoryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;
}

