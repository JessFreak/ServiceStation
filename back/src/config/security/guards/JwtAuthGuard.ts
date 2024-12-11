import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserRepository } from '../../../database/repositories/UserRepository';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];

    if (!token) return false;

    const { sub } = this.jwtService.verify(token);

    const user = await this.userRepository.findById(sub);
    delete user.password;

    request.user = user;
    return true;
  }
}
