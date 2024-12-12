import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../database/PrismaService';
import { UserRepository } from '../database/repositories/UserRepository';
import { VehicleRepository } from '../database/repositories/VehicleRepository';
import { ServiceRepository } from '../database/repositories/ServiceRepository';

@Global()
@Module({
  providers: [PrismaService, UserRepository, VehicleRepository, ServiceRepository],
  exports: [PrismaService, UserRepository, VehicleRepository, ServiceRepository],
})
export class PrismaModule {}