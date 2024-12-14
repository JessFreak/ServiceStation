import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../database/repositories/OrderRepository';
import { CreateOrderDTO, OrderQueryDTO } from '../utils/dtos/OrderDTO';
import { UserRepository } from '../database/repositories/UserRepository';
import { NoAvailableWorkerException } from '../utils/exceptions/NoAvailableWorkerException';
import { Role, Status } from '@prisma/client';
import { Worker } from '../database/entities/Worker';
import { OrderDB } from '../database/entities/OrderDB';

@Injectable()
export class OrderService {
  constructor (
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create (data: CreateOrderDTO):Promise<OrderDB> {
    const worker = await this.findAvailableWorker(data.orderDate);
    if (!worker) throw new NoAvailableWorkerException();

    return this.orderRepository.create({
      orderDate: data.orderDate,
      vehicleId: data.vehicleId,
      services: {
        createMany: {
          data: data.services.map((s) => ({ serviceId: s })),
        },
      },
      workerId: worker.id,
    });
  }

  private async findAvailableWorker (orderDate: string): Promise<Worker> {
    const workers = await this.userRepository.findMany({
      where: {
        role: Role.WORKER,
        workingOrders: {
          none: {
            orderDate: {
              equals: orderDate,
            },
          },
        },
      },
      include: {
        workingOrders: true,
      },
    }) as Worker[];

    if (workers.length === 0) {
      return null;
    }

    return workers.reduce((prev, current) => {
      return prev.workingOrders.length < current.workingOrders.length ? prev : current;
    });
  }

  async getAll ({ workerId, userId, status, serviceId }: OrderQueryDTO) {
    return this.orderRepository.findMany({
      workerId,
      vehicle: {
        userId,
      },
      status,
      services: {
        some: {
          serviceId,
        }
      }
    });
  }

  async updateWorker (id: string, workerId: string):Promise<OrderDB> {
    return this.orderRepository.updateById(id, { workerId });
  }

  async updateStatus (id: string, status: Status):Promise<OrderDB> {
    return this.orderRepository.updateById(id, { status });
  }
}