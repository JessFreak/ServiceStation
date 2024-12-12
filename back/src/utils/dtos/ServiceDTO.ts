import { IsNumber, IsOptional, IsString, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IsActiveDTO } from './IsActiveDTO';

export class CreateServiceDTO extends IsActiveDTO {
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
}

export class UpdateServiceDTO extends PartialType(CreateServiceDTO) {}
