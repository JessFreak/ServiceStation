import { User } from '@prisma/client';
import { UserResponse } from '../types/UserResponse';

export class UserMapper {
  static getUserResponse(user: User): UserResponse {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static getUsersResponse(users: User[]): UserResponse[] {
    return users.map(this.getUserResponse);
  }
}
