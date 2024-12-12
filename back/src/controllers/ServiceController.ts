import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ServiceService } from '../services/ServiceService';
import { Access } from '../config/security/decorators/Access';
import { Role, Service } from '@prisma/client';
import { CreateServiceDTO, UpdateServiceDTO } from '../utils/dtos/ServiceDTO';

@Controller('services')
export class ServiceController {
  constructor (private readonly serviceService: ServiceService) {}

  @Post()
  @Access(Role.ADMIN)
  create (@Body() body: CreateServiceDTO): Promise<Service> {
    return this.serviceService.create(body);
  }

  @Get()
  @Access()
  getAll (): Promise<Service[]> {
    return this.serviceService.getAll();
  }

  @Patch(':serviceId')
  @Access(Role.ADMIN)
  update (@Param('serviceId') serviceId: string, @Body() body: UpdateServiceDTO): Promise<Service> {
    return this.serviceService.updateById(serviceId, body);
  }

  @Delete(':serviceId')
  @Access(Role.ADMIN)
  delete (@Param('serviceId') serviceId: string): Promise<Service> {
    return this.serviceService.deleteById(serviceId);
  }
}