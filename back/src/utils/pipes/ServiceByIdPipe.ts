import { EntityByIdPipe } from './EntityByIdPipe';
import { ServiceRepository } from '../../database/repositories/ServiceRepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceByIdPipe extends EntityByIdPipe {
  constructor (private readonly serviceRepository: ServiceRepository) {
    super('Service', serviceRepository);
  }
}