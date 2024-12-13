import { Injectable } from '@nestjs/common';
import { EntityByIdPipe } from './EntityByIdPipe';
import { UserRepository } from '../../database/repositories/UserRepository';

@Injectable()
export class UserByIdPipe extends EntityByIdPipe {
  constructor (private readonly userRepository: UserRepository) {
    super('User', userRepository);
  }
}