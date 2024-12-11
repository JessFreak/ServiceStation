import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const port = process.env.PORT;
  await app.listen(port ?? 3000);

  console.log(`Started server on localhost:${port}`);
}
bootstrap();
