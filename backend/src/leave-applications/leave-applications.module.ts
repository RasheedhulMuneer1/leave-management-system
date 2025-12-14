import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveApplicationsService } from './leave-applications.service.js';
import { LeaveApplicationsController } from './leave-applications.controller.js';
import { LeaveApplication } from '../entities/leave-application.entity.js';
import { Role } from '../entities/role.entity.js';
import { Establishment } from '../entities/establishment.entity.js';
import { User } from 'entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveApplication, Role, Establishment, User])],
  // NotificationsModule,  
  providers: [LeaveApplicationsService],
  controllers: [LeaveApplicationsController],
})
export class LeaveApplicationsModule {}
