import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../database/repositories/UserRepository';
import { LoginDTO, RegisterDTO } from '../dtos/AuthDTO';
import { Response } from 'express';
import { AlreadyRegisteredException } from '../utils/exceptions/AlreadyRegisteredException';
import { GoogleUser } from '../utils/types/GoogleUser';

@Injectable()
export class AuthService {
  constructor (
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async register (user: RegisterDTO) {
    const exist = this.userRepository.findByEmail(user.email);
    if (exist) {
      throw new BadRequestException('Email is already registered');
    }

    const hashedPassword = await hash(user.password, 10);

    await this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
  }

  async login ({ email, password }: LoginDTO) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AlreadyRegisteredException();

    const isPasswordsMatch = await compare(password, user.password);
    if (!isPasswordsMatch) throw new BadRequestException('Invalid password');

    return { id: user.id };
  }

  async validateGoogleUser (googleUser: GoogleUser) {
    const user = await this.userRepository.findByEmail(googleUser.email);
    if (user) return user;

    return this.userRepository.create(googleUser);
  }

  setToken (userId: string, res: Response): Response {
    const token = this.jwtService.sign({
      sub: userId,
    });

    res.cookie('access_token', token);
    return res.status(200).json();
  }

  logout(res: Response): Response {
    res.clearCookie('access_token');
    return res.status(200).json();
  }
}
