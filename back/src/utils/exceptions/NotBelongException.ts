import { BadRequestException } from '@nestjs/common';

export class NotBelongException extends BadRequestException {
  constructor(targetEntity: string, parentEntity: string) {
    super(`The ${targetEntity} does not belong to this ${parentEntity}`);
  }
}
