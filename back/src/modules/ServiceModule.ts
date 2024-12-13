import { Module } from '@nestjs/common';
import { ServiceController } from '../controllers/ServiceController';
import { ServiceService } from '../services/ServiceService';
import { ServiceByIdPipe } from '../utils/pipes/ServiceByIdPipe';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, ServiceByIdPipe],
  exports: [ServiceService, ServiceByIdPipe],
})
export class ServiceModule {}