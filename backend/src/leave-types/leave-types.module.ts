import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveType } from '../entities/leave-type.entity.js';
import { LeaveTypesService } from './leave-types.service.js';
import { LeaveTypesController } from './leave-types.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveType])],
  providers: [LeaveTypesService],
  controllers: [LeaveTypesController],
})
export class LeaveTypesModule {}
