import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { PrismaModule } from './modules/PrismaModule';
import { AuthModule } from './modules/AuthModule';
import { UserModule } from './modules/UserModule';
import { ServiceModule } from './modules/ServiceModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ServiceModule,
  ],
})
export class AppModule {}
