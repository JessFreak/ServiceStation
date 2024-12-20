import { BadRequestException } from '@nestjs/common';

export class NotBelongException extends BadRequestException {
  constructor (targetEntity: string, parentEntity: string) {
    super(`Цей ${targetEntity} не належить цьому ${parentEntity}`);
  }
}