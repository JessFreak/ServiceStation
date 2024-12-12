import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { OrderModule } from './OrderModule';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  imports: [OrderModule],
})
export class UserModule {}