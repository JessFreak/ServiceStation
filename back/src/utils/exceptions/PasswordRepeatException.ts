import { BadRequestException } from '@nestjs/common';

export class PasswordRepeatException extends BadRequestException {
  constructor () {
    super('The passwords are the same');
  }
}