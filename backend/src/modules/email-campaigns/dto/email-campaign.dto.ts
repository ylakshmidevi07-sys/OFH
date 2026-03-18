import { IsString, IsOptional, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { CampaignType } from '@prisma/client';

export class CreateEmailCampaignDto {
  @IsString()
  name: string;

  @IsEnum(CampaignType)
  type: CampaignType;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  htmlContent?: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  triggerEvent?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

export class UpdateEmailCampaignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CampaignType)
  type?: CampaignType;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  htmlContent?: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  triggerEvent?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

