import { PipeTransform } from '@nestjs/common';
import { InvalidEntityIdException } from '../exceptions/InvalidEntityIdException';

export class EntityByIdPipe implements PipeTransform<string, Promise<string>> {
  constructor (private readonly name: string, private readonly repository: any) {}

  async transform (id: string): Promise<string> {
    const entity = await this.repository.findById(id);

    if (!entity) {
      throw new InvalidEntityIdException(this.name);
    }

    return id;
  }
}
