import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { Prisma, Service } from '@prisma/client';

@Injectable()
export class ServiceRepository {
  constructor (private readonly prisma: PrismaService) {}

  async create (data: Prisma.ServiceUncheckedCreateInput): Promise<Service> {
    return this.prisma.service.create({ data });
  }

  async findMany (where: Prisma.ServiceWhereInput): Promise<Service[]> {
    return this.prisma.service.findMany({ where });
  }

  async findById (id: string): Promise<Service> {
    return this.prisma.service.findFirst({ where: { id } });
  }

  async updateById (id: string, data: Prisma.ServiceUncheckedUpdateInput): Promise<Service> {
    return this.prisma.service.update({ where: { id: id }, data });
  }

  async deleteById (id: string): Promise<Service> {
    return this.prisma.service.delete({ where: { id: id } });
  }
}