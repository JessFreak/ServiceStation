import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { GoogleOauthGuard } from '../config/security/guards/GoogleOAuthGuard';
import { JwtAuthGuard } from '../config/security/guards/JwtAuthGuard';
import { GoogleStrategy } from '../config/security/strategies/GoogleStrategy';
import { JwtStrategy } from '../config/security/strategies/JwtStrategy';
import { JwtModule } from '@nestjs/jwt';
import config from '../config/config';
import { RoleGuard } from '../config/security/guards/RoleGuard';

@Module({
  imports: [
    JwtModule.registerAsync(config.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleOauthGuard,
    JwtAuthGuard,
    GoogleStrategy,
    JwtStrategy,
    RoleGuard
  ],
  exports: [AuthService],
})
export class AuthModule {}