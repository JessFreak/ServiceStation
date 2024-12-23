import { User } from '@prisma/client';
import { UserResponse } from '../types/UserResponse';

export class UserMapper {
  static getUserResponse (user: User): UserResponse {
    if (!user) return null;
    delete user.password;
    return user;
  }

  static getUsersResponse (users: User[]): UserResponse[] {
    return users.map(this.getUserResponse);
  }
}
