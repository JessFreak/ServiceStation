import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ServiceService } from '../services/ServiceService';
import { Access } from '../config/security/decorators/Access';
import { Role, Service } from '@prisma/client';
import { CreateServiceDTO, ServiceQueryDTO, UpdateServiceDTO } from '../utils/dtos/ServiceDTO';
import { ServiceByIdPipe } from '../utils/pipes/ServiceByIdPipe';

@Controller('services')
export class ServiceController {
  constructor (private readonly serviceService: ServiceService) {}

  @Post()
  @Access(Role.ADMIN)
  create (@Body() body: CreateServiceDTO): Promise<Service> {
    return this.serviceService.create(body);
  }

  @Get()
  getAll (@Query() query: ServiceQueryDTO): Promise<Service[]> {
    return this.serviceService.getAll(query);
  }

  @Patch(':serviceId')
  @Access(Role.ADMIN)
  update (
    @Param('serviceId', ServiceByIdPipe) serviceId: string,
    @Body() body: UpdateServiceDTO,
  ): Promise<Service> {
    return this.serviceService.updateById(serviceId, body);
  }

  @Delete(':serviceId')
  @Access(Role.ADMIN)
  delete (@Param('serviceId', ServiceByIdPipe) serviceId: string): Promise<Service> {
    return this.serviceService.deleteById(serviceId);
  }
}