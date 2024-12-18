import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../database/repositories/ServiceRepository';
import { CreateServiceDTO, ServiceQueryDTO, UpdateServiceDTO } from '../utils/dtos/ServiceDTO';
import { Service } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor (private readonly serviceRepository: ServiceRepository) {}

  async create (data: CreateServiceDTO): Promise<Service> {
    return this.serviceRepository.create(data);
  }

  async getAll({ isActive, name, minPrice, maxPrice }: ServiceQueryDTO): Promise<Service[]> {
    if (maxPrice < minPrice) return [];

    return this.serviceRepository.findMany({
      isActive,
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      price: { gte: minPrice, lte: maxPrice },
    });
  }

  async updateById (id: string, data: UpdateServiceDTO): Promise<Service> {
    return this.serviceRepository.updateById(id, data);
  }

  async deleteById (id: string): Promise<Service> {
    return this.serviceRepository.deleteById(id);
  }
}