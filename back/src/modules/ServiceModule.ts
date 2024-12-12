import { Module } from '@nestjs/common';
import { ServiceController } from '../controllers/ServiceController';
import { ServiceService } from '../services/ServiceService';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}