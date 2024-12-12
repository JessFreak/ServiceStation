import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../database/PrismaService';
import { UserRepository } from '../database/repositories/UserRepository';
import { VehicleRepository } from '../database/repositories/VehicleRepository';
import { ServiceRepository } from '../database/repositories/ServiceRepository';
import { OrderRepository } from '../database/repositories/OrderRepository';

@Global()
@Module({
  providers: [PrismaService, UserRepository, VehicleRepository, ServiceRepository, OrderRepository],
  exports: [PrismaService, UserRepository, VehicleRepository, ServiceRepository, OrderRepository],
})
export class PrismaModule {}