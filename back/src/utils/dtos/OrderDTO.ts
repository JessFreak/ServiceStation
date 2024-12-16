import { IsArray, IsUUID, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Status } from '@prisma/client';
import { IsValidOrderDate } from './decorators/IsValidOrderDate';
import { IntersectionType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsValidOrderDate({
    timeZone: 'Europe/Kiev',
    startHour: 8,
    endHour: 20,
    difference: 4,
  })
  orderDate: string;

  @IsNotEmpty()
  @IsUUID()
  vehicleId: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('all', { each: true })
  services: string[];
}

export class WorkerDTO {
  @IsNotEmpty()
  @IsUUID()
  workerId: string;
}

export class StatusDTO {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}

export class OrderQueryDTO extends PartialType(IntersectionType(WorkerDTO, StatusDTO)) {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @IsOptional()
  @IsDateString()
  orderDay?: string;
}