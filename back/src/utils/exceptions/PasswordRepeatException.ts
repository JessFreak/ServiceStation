import { BadRequestException } from '@nestjs/common';

export class PasswordRepeatException extends BadRequestException {
  constructor () {
    super('Новий пароль не може співпадати з минулим');
  }
}