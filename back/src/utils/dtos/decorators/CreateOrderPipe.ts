import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateOrderDTO } from '../OrderDTO';
import { VehicleByIdPipe } from '../../pipes/VehicleByIdPipe';
import { ServiceByIdPipe } from '../../pipes/ServiceByIdPipe';

@Injectable()
export class CreateOrderPipe implements PipeTransform<CreateOrderDTO, Promise<CreateOrderDTO>> {
  constructor (
    private readonly vehicleByIdPipe: VehicleByIdPipe,
    private readonly serviceByIdPipe: ServiceByIdPipe,
  ) {}

  async transform (value: CreateOrderDTO): Promise<CreateOrderDTO> {
    await Promise.all([
      this.vehicleByIdPipe.transform(value.vehicleId),
      ...value.services.map((serviceId) => this.serviceByIdPipe.transform(serviceId)),
    ]);

    return value;
  }
}
