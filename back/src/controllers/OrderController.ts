import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateOrderDTO, OrderQueryDTO, StatusDTO, WorkerDTO } from '../utils/dtos/OrderDTO';
import { OrderService } from '../services/OrderService';
import { Access } from '../config/security/decorators/Access';
import { Role, User } from '@prisma/client';
import { UserRequest } from '../config/security/decorators/UserRequest';
import { OrderResponse } from '../utils/types/OrderResponse';
import { OrderMapper } from '../utils/mappers/OrderMapper';

@Controller('orders')
export class OrderController {
  constructor (private readonly orderService: OrderService) {}

  @Post()
  async create (@Body() body: CreateOrderDTO): Promise<OrderResponse> {
    const order = await this.orderService.create(body);
    return OrderMapper.getOrderResponse(order);
  }

  @Get()
  @Access(Role.ADMIN)
  async getAll (@Query() query: OrderQueryDTO): Promise<OrderResponse[]>{
    const orders = await this.orderService.getAll(query);
    return OrderMapper.getOrdersResponse(orders);
  }

  @Get('assigned')
  @Access(Role.WORKER)
  async getAllAssigned (@UserRequest() user: User, @Query() query: OrderQueryDTO): Promise<OrderResponse[]> {
    const orders = await this.orderService.getAll({ ...query, workerId: user.id });
    return OrderMapper.getOrdersResponse(orders);
  }

  @Patch(':orderId/worker')
  @Access(Role.ADMIN)
  async updateWorker (@Param('orderId') orderId: string, @Body() body: WorkerDTO): Promise<OrderResponse> {
    const order = await this.orderService.updateWorker(orderId, body.workerId);
    return OrderMapper.getOrderResponse(order);
  }

  @Patch(':orderId/status')
  @Access(Role.WORKER)
  async updateStatus (@Param('orderId') orderId: string, @Body() body: StatusDTO): Promise<OrderResponse> {
    const order = await this.orderService.updateStatus(orderId, body.status);
    return OrderMapper.getOrderResponse(order);
  }
}