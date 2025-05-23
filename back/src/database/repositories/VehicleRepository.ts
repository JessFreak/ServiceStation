import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { Prisma, Vehicle } from '@prisma/client';

@Injectable()
export class VehicleRepository {
  constructor (private readonly prisma: PrismaService) {}

  async create (data: Prisma.VehicleUncheckedCreateInput): Promise<Vehicle> {
    return this.prisma.vehicle.create({ data });
  }

  async findMany (where: Prisma.VehicleWhereInput): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({ where, orderBy: { year: 'desc' } });
  }

  async findById (id: string): Promise<Vehicle> {
    return this.prisma.vehicle.findFirst({ where: { id } });
  }

  async find (where: Prisma.VehicleWhereInput): Promise<Vehicle> {
    return this.prisma.vehicle.findFirst({ where });
  }

  async updateById (id: string, data: Prisma.VehicleUncheckedUpdateInput): Promise<Vehicle> {
    return this.prisma.vehicle.update({ where: { id: id }, data });
  }

  async deleteById (id: string): Promise<Vehicle> {
    return this.prisma.vehicle.delete({ where: { id } });
  }
}