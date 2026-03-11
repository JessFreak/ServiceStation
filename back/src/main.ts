import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: { origin: true, credentials: true, exposedHeaders: ['Set-Cookie'] }
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.enableShutdownHooks();

  ['SIGTERM', 'SIGINT'].forEach((signal) => {
    process.on(signal, () => {
      logger.log(`${signal} received. Starting graceful shutdown...`);
    });
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(cookieParser());

  const port = process.env.PORT;
  await app.listen(port);

  logger.log(`Started server on port ${port}`);
}

bootstrap();