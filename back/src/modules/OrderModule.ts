import { Module } from '@nestjs/common';
import { OrderService } from '../services/OrderService';
import { OrderController } from '../controllers/OrderController';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}