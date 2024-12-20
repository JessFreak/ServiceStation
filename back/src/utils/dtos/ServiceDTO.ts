import { IsNumber, IsOptional, IsString, Min, MaxLength, IsNotEmpty, IsBoolean, IsUrl } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ToBoolean } from './decorators/ToBoolean';

export class IsActiveDTO {
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
    isActive?: boolean;
}

export class ServiceQueryDTO extends IsActiveDTO {
  @IsOptional()
  @IsString()
    name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
    minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
    maxPrice?: number;
}

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

  @IsOptional()
  @IsUrl()
    imageUrl?: string;
}

export class UpdateServiceDTO extends PartialType(CreateServiceDTO) {}
