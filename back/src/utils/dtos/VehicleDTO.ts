import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from '@prisma/client';

export class CreateVehicleDTO {
  @IsNotEmpty()
  @IsString()
    model: string;

  @IsNotEmpty()
  @IsNumber()
    year: number;

  @IsNotEmpty()
  @IsString()
    vin: string;

  @IsNotEmpty()
  @IsEnum(Type)
    type: Type;
}

export class UpdateVehicleDTO extends PartialType(CreateVehicleDTO) {}
