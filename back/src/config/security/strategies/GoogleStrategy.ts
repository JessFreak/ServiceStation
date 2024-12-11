import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import config from '../../config';
import { AuthService } from '../../../services/AuthService';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor (
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.google.clientID,
      clientSecret: configService.google.clientSecret,
      callbackURL: configService.google.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate (
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, email, picture } = profile;

    const user = this.authService.validateGoogleUser({
      email,
      name: name.givenName,
      surname: name.familyName,
      avatarUrl: picture,
      password: '',
    });

    done(null, user);
  }
}