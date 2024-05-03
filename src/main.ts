import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const port = process.env.APP_PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(express.static(join(__dirname, '..', '..', 'uploads')))
  app.enableCors();
  await app.listen(port);
  console.log(`server started at ${port} port!`, join(__dirname, '..', '..', 'uploads'))
}
bootstrap();
