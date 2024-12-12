import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/AuthService';
import { GoogleOauthGuard } from '../config/security/guards/GoogleOAuthGuard';
import { LoginDTO, RegisterDTO } from '../utils/dtos/AuthDTO';
import { UserRequest } from '../config/security/decorators/UserRequest';
import { User } from '@prisma/client';
import { Access } from '../config/security/decorators/Access';
import { UpdatePasswordDto } from '../utils/dtos/ChangePasswordDTO';

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
    await this.authService.register(body);
  }

  @Post('login')
  async login (@Body() body: LoginDTO, @Res() res: Response): Promise<Response> {
    const { id } = await this.authService.login(body);
    return this.authService.setToken(id, res);
  }

  @Access()
  @Post('logout')
  logout (@Res() res: Response): Response {
    return this.authService.logout(res);
  }

  @Access()
  @Get('me')
  getMe (@UserRequest() user: User): User {
    return user;
  }

  @Access()
  @Delete('me')
  deleteMe(@UserRequest() user: User, @Res() res: Response): Promise<Response> {
    return this.authService.deleteMe(user.id, res);
  }

  @Access()
  @Patch('password')
  async updatePassword (@UserRequest() user: User, @Body() body: UpdatePasswordDto): Promise<void> {
    return this.authService.updatePassword(user.id, body);
  }
}