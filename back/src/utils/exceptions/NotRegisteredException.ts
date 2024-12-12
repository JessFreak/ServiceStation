import { BadRequestException } from '@nestjs/common';

export class NotRegisteredException extends BadRequestException {
  constructor() {
    super('User is not registered');
  }
}
