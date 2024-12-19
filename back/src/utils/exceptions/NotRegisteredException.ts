import { BadRequestException } from '@nestjs/common';

export class NotRegisteredException extends BadRequestException {
  constructor() {
    super('Користувач з цією поштою не зареєстрований');
  }
}