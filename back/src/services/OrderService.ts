import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../database/repositories/OrderRepository';
import { CreateOrderDTO, OrderQueryDTO } from '../utils/dtos/OrderDTO';
import { UserRepository } from '../database/repositories/UserRepository';
import { NoAvailableWorkerException } from '../utils/exceptions/NoAvailableWorkerException';
import { Role, Status } from '@prisma/client';
import { Worker } from '../database/entities/Worker';
import { OrderDB } from '../database/entities/OrderDB';
import { NotBelongException } from '../utils/exceptions/NotBelongException';

@Injectable()
export class OrderService {
  constructor (
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create (data: CreateOrderDTO): Promise<OrderDB> {
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
              gte: new Date(new Date(orderDate).setHours(new Date(orderDate).getHours() - 1)),
              lte: new Date(new Date(orderDate).setHours(new Date(orderDate).getHours() + 1)),
            },
            status: {
              notIn: [Status.DONE, Status.CANCELED],
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

  async getAll ({ workerId, userId, status, serviceId, vehicleId, orderDay }: OrderQueryDTO) {
    const day = orderDay ? new Date(`${orderDay}T00:00:00.000Z`) : null;
    const nextDay = orderDay ? new Date(`${orderDay}T23:59:59.999Z`) : null;

    return this.orderRepository.findMany({
      vehicleId,
      workerId,
      vehicle: {
        userId,
      },
      status,
      services: {
        some: {
          serviceId,
        }
      },
      orderDate: day ? { gte: day, lte: nextDay } : undefined,
    });
  }

  async updateWorker (id: string, workerId: string): Promise<OrderDB> {
    return this.orderRepository.updateById(id, { workerId });
  }

  async updateStatus (id: string, status: Status): Promise<OrderDB> {
    return this.orderRepository.updateById(id, { status });
  }

  async cancel (userId: string, id: string): Promise<OrderDB> {
    const order = await this.orderRepository.findById(id);
    if (order.vehicle.userId !== userId) {
      throw new NotBelongException('Order', 'User');
    }

    return this.orderRepository.updateById(id, { status: Status.CANCELED });
  }
}