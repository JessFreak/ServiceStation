import { Global, Module } from '@nestjs/common';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { GoogleOauthGuard } from '../config/security/guards/GoogleOAuthGuard';
import { JwtAuthGuard } from '../config/security/guards/JwtAuthGuard';
import { GoogleStrategy } from '../config/security/strategies/GoogleStrategy';
import { JwtModule } from '@nestjs/jwt';
import config from '../config/config';
import { RoleGuard } from '../config/security/guards/RoleGuard';

@Global()
@Module({
  imports: [JwtModule.registerAsync(config.asProvider())],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleOauthGuard,
    JwtAuthGuard,
    GoogleStrategy,
    RoleGuard,
  ],
  exports: [
    AuthService,
    GoogleOauthGuard,
    JwtAuthGuard,
    GoogleStrategy,
    RoleGuard,
    JwtModule,
  ],
})
export class AuthModule {}