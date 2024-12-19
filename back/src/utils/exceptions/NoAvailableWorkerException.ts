import { BadRequestException } from '@nestjs/common';

export class NoAvailableWorkerException extends BadRequestException {
  constructor() {
    super('Не знайдено доступних працівників на цей час');
  }
}