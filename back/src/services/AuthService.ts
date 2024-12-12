import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../database/repositories/UserRepository';
import { LoginDTO, RegisterDTO } from '../utils/dtos/AuthDTO';
import { Response } from 'express';
import { AlreadyRegisteredException } from '../utils/exceptions/AlreadyRegisteredException';
import { GoogleUser } from '../utils/types/GoogleUser';
import { NotRegisteredException } from '../utils/exceptions/NotRegisteredException';
import { PasswordRepeatException } from '../utils/exceptions/PasswordRepeatException';
import { UpdatePasswordDto } from '../utils/dtos/ChangePasswordDTO';

@Injectable()
export class AuthService {
  constructor (
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async register (user: RegisterDTO) {
    const exist = await this.userRepository.findByEmail(user.email);
    if (exist) {
      throw new AlreadyRegisteredException;
    }

    const hashedPassword = await hash(user.password, 10);

    await this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
  }

  private async validatePassword (password: string, userPassword: string): Promise<void> {
    const isPasswordsMatch = await compare(password, userPassword);
    if (!isPasswordsMatch) throw new BadRequestException('Invalid password');
  }

  async login ({ email, password }: LoginDTO) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotRegisteredException;

    await this.validatePassword(password, user.password);

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

  async deleteMe(userId: string, res: Response): Promise<Response> {
    await this.userRepository.deleteById(userId);
    return this.logout(res);
  }

  async updatePassword(userId: string, { oldPassword, newPassword }: UpdatePasswordDto) {
    const user = await this.userRepository.findById(userId);
    await this.validatePassword(oldPassword, user.password);

    if (oldPassword === newPassword) {
      throw new PasswordRepeatException;
    }

    const hashedPassword = await hash(newPassword, 10);
    await this.userRepository.updateById(userId, { password: hashedPassword });
  }
}
