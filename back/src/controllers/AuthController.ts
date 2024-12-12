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
import { UserRequest } from '../config/security/decorators/UserRequest';
import { User } from '@prisma/client';
import { Access } from '../config/security/decorators/Access';

@Controller('/auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  auth (): void {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  googleAuthCallback (@UserRequest() user: User, @Res() res: Response): Response {
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

  @Access()
  @Get('me')
  getMe (@UserRequest() user: User): User {
    return user;
  }

  @Access()
  @Post('logout')
  logout (@Res() res: Response): Response {
    return this.authService.logout(res);
  }
}