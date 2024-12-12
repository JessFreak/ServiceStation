import { IsBoolean, IsNumber, IsOptional, IsString, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}

export class UpdateServiceDTO extends PartialType(CreateServiceDTO) {}
