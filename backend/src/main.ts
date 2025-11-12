import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // enables DTO validation


  // enables cors for frontend
  app.enableCors({ 
    origin: 'http://localhost:3001', // frontend url
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3002); // backend port
  console.log('Backend running on http://localhost:3002'); // backend url


  const dataSource = app.get(DataSource);
  const roleRepo = dataSource.getRepository(Role);

  const defaultRoles = [
    'Super Admin',
    'System Admin',
    'Establishment Admin',
    'Establishment Head & Leave Approve Member',
    'Standard Member',
  ];

  for (const name of defaultRoles) {
    const exists = await roleRepo.findOne({ where: { name } });
    if (!exists) {
      await roleRepo.save(roleRepo.create({ name }));
      console.log(`Inserted role: ${name}`);
    }
  }
}
bootstrap();
