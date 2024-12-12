import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { PrismaModule } from './modules/PrismaModule';
import { AuthModule } from './modules/AuthModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
