import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../database/repositories/ServiceRepository';
import { CreateServiceDTO, IsActiveDTO, UpdateServiceDTO } from '../utils/dtos/ServiceDTO';
import { Service } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor (private readonly serviceRepository: ServiceRepository) {}

  async create (data: CreateServiceDTO): Promise<Service> {
    return this.serviceRepository.create(data);
  }

  async getAll({ isActive }: IsActiveDTO): Promise<Service[]> {
    console.log(isActive);
    return this.serviceRepository.findMany({ isActive });
  }

  async updateById (id: string, data: UpdateServiceDTO): Promise<Service> {
    return this.serviceRepository.updateById(id, data);
  }

  async deleteById (id: string): Promise<Service> {
    return this.serviceRepository.deleteById(id);
  }
}