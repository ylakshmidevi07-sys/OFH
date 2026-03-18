import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  orderId: string;

  @IsString()
  paymentProvider: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsNumber()
  @Min(0)
  amount: number;
}

export class UpdatePaymentStatusDto {
  @IsString()
  paymentStatus: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

