import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../database/PrismaService';
import { UserRepository } from '../database/repositories/UserRepository';
import { VehicleRepository } from '../database/repositories/VehicleRepository';

@Global()
@Module({
  providers: [PrismaService, UserRepository, VehicleRepository],
  exports: [PrismaService, UserRepository, VehicleRepository],
})
export class PrismaModule {}