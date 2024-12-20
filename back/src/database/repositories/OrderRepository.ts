import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { Prisma } from '@prisma/client';
import { OrderDB } from '../entities/OrderDB';

@Injectable()
export class OrderRepository {
  constructor (private readonly prisma: PrismaService) {}

  private include = {
    services: {
      include: {
        service: true,
      },
    },
    worker: true,
    vehicle: {
      include: {
        user: true,
      },
    },
  };

  async create (data: Prisma.OrderUncheckedCreateInput): Promise<OrderDB> {
    return this.prisma.order.create({ data, include: this.include });
  }

  async findMany (where: Prisma.OrderWhereInput): Promise<OrderDB[]> {
    return this.prisma.order.findMany({ where, include: this.include, orderBy: { orderDate: 'desc' } });
  }

  async findById (id: string): Promise<OrderDB> {
    return this.prisma.order.findFirst({ where: { id }, include: this.include });
  }

  async updateById (id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<OrderDB> {
    return this.prisma.order.update({ where: { id: id }, data, include: this.include });
  }
}