import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { User } from '../entities/user.entity.js';
import { Role } from '../entities/role.entity.js';
import { Establishment } from '../entities/establishment.entity.js';
import { Users } from '../entities/users.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Role, Establishment]), // register all needed entities
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}


