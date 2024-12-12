import { BadRequestException } from '@nestjs/common';

export class NoAvailableWorkerException extends BadRequestException {
  constructor() {
    super('No available workers found for this time');
  }
}
