import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { OrderModule } from './OrderModule';
import { UserByIdPipe } from '../utils/pipes/UserByIdPipe';
import { VehicleByIdPipe } from '../utils/pipes/VehicleByIdPipe';

@Module({
  imports: [forwardRef(() => OrderModule)],
  controllers: [UsersController],
  providers: [UserService, UserByIdPipe, VehicleByIdPipe],
  exports: [UserService, UserByIdPipe, VehicleByIdPipe],
})
export class UserModule {}