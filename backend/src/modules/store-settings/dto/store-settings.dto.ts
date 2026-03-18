import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class UpdateStoreSettingsDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @IsOptional()
  @IsNumber()
  shippingBaseCost?: number;

  @IsOptional()
  @IsNumber()
  freeShippingMin?: number;

  @IsOptional()
  @IsString()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsOptional()
  @IsObject()
  themeConfig?: Record<string, any>;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, any>;
}

