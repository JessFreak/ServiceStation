import { OrderResponse, ServiceResponse } from '../types/OrderResponse';
import { OrderDB, OrderServiceWithService } from '../../database/entities/OrderDB';
import { UserMapper } from './UserMapper';

export class OrderMapper {
  static getServiceResponse(orderService: OrderServiceWithService): ServiceResponse {
    return orderService.service;
  }

  static getOrderResponse({ workerId, vehicleId, ...order }: OrderDB): OrderResponse {
    const services = order.services.map(OrderMapper.getServiceResponse);
    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);

    return {
      ...order,
      totalPrice,
      services,
      worker: UserMapper.getUserResponse(order.worker),
      user: UserMapper.getUserResponse(order?.vehicle?.user),
    };
  }

  static getOrdersResponse(orders: OrderDB[]): OrderResponse[] {
    return orders.map(OrderMapper.getOrderResponse);
  }
}
