import { Injectable } from '@nestjs/common';
import { EntityByIdPipe } from './EntityByIdPipe';
import { OrderRepository } from '../../database/repositories/OrderRepository';

@Injectable()
export class OrderByIdPipe extends EntityByIdPipe {
  constructor (private readonly orderRepository: OrderRepository) {
    super('Order', orderRepository);
  }
}