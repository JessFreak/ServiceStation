import { Injectable } from '@nestjs/common';
import { EntityByIdPipe } from './EntityByIdPipe';
import { VehicleRepository } from '../../database/repositories/VehicleRepository';

@Injectable()
export class VehicleByIdPipe extends EntityByIdPipe {
  constructor (private readonly vehicleRepository: VehicleRepository) {
    super('Vehicle', vehicleRepository);
  }
}