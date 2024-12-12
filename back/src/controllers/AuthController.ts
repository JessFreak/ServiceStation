import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/AuthService';
import { GoogleOauthGuard } from '../config/security/guards/GoogleOAuthGuard';
import { LoginDTO, RegisterDTO } from '../dtos/AuthDTO';
import { JwtAuthGuard } from '../config/security/guards/JwtAuthGuard';
import { UserRequest } from '../utils/decorators/UserRequest';
import { User } from '@prisma/client';

@Controller('/auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth (): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback (@UserRequest() user: User, @Res() res: Response): Promise<Response> {
    return this.authService.setToken(user.id, res);
  }

  @Post('register')
  async register (
    @Body() body: RegisterDTO,
  ): Promise<void> {
    return this.authService.register(body);
  }

  @Post('login')
  async login (@Body() body: LoginDTO, @Res() res: Response): Promise<Response> {
    const { id } = await this.authService.login(body);
    return this.authService.setToken(id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe (@UserRequest() user: User): User {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout (@Res() res: Response): Response {
    return this.authService.logout(res);
  }
}