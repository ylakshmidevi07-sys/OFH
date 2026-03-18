import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { PricingRuleType, PricingTargetType } from '@prisma/client';

export class CreatePricingRuleDto {
  @IsString()
  name: string;

  @IsEnum(PricingRuleType)
  type: PricingRuleType;

  @IsEnum(PricingTargetType)
  targetType: PricingTargetType;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsInt()
  minQuantity?: number;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePricingRuleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PricingRuleType)
  type?: PricingRuleType;

  @IsOptional()
  @IsEnum(PricingTargetType)
  targetType?: PricingTargetType;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsInt()
  minQuantity?: number;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

