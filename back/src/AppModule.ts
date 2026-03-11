import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { PrismaModule } from './modules/PrismaModule';
import { AuthModule } from './modules/AuthModule';
import { UserModule } from './modules/UserModule';
import { ServiceModule } from './modules/ServiceModule';
import { OrderModule } from './modules/OrderModule';
import { HealthModule } from './modules/HealthModule';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req: (req) => ({ method: req.method, url: req.url }),
          res: (res) => ({ statusCode: res.statusCode }),
        },
        formatters: {
          level: (label) => ({ level: label.toUpperCase() }),
        },
        messageKey: 'message',
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
        base: undefined,
        transport: process.env.NODE_ENV !== 'production'
          ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              ignore: 'pid,hostname,req,res',
              messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms'
            }
          }
          : undefined,
      },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ServiceModule,
    OrderModule,
    HealthModule,
  ],
})
export class AppModule {}
