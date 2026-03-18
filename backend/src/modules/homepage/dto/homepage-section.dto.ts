import { IsEnum, IsOptional, IsString, IsBoolean, IsInt, IsObject } from 'class-validator';
import { HomepageSectionType } from '@prisma/client';

export class CreateHomepageSectionDto {
  @IsEnum(HomepageSectionType)
  type: HomepageSectionType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class UpdateHomepageSectionDto {
  @IsOptional()
  @IsEnum(HomepageSectionType)
  type?: HomepageSectionType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

