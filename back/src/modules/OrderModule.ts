import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { OrderByIdPipe } from '../utils/pipes/OrderByIdPipe';
import { CreateOrderPipe } from '../utils/dtos/decorators/CreateOrderPipe';
import { UserModule } from './UserModule';
import { ServiceModule } from './ServiceModule';

@Module({
  imports: [forwardRef(() => UserModule), ServiceModule],
  controllers: [OrderController],
  providers: [OrderService, OrderByIdPipe, CreateOrderPipe],
  exports: [OrderService, OrderByIdPipe, CreateOrderPipe],
})
export class OrderModule {}