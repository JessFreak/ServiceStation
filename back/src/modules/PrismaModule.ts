import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../database/PrismaService';
import { UserRepository } from '../database/repositories/UserRepository';

@Global()
@Module({
  providers: [PrismaService, UserRepository],
  exports: [PrismaService, UserRepository],
})
export class PrismaModule {}