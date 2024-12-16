import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap () {
  const app = await NestFactory.create(AppModule, { cors: { origin: true, credentials: true, exposedHeaders: ['Set-Cookie'] } });

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

  console.log(`Started server on localhost:${port}`);
}

bootstrap();
