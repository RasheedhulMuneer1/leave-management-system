import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for React frontend (Docker-safe)
  app.enableCors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3002;

  // REQUIRED for Docker (DO NOT use localhost here)
  await app.listen(port, '0.0.0.0');

  console.log(`NestJS backend running on http://localhost:${port}`);
}

bootstrap();
