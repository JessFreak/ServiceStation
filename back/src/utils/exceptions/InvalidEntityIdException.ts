import { BadRequestException } from '@nestjs/common';

export class InvalidEntityIdException extends BadRequestException {
  constructor(entity: string) {
    super(`${entity} з таким id не знайдено`);
  }
}