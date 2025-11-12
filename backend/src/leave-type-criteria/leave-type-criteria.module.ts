import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveTypeCriteria } from '../entities/leave-type-criteria.entity';
import { LeaveTypeCriteriaService } from './leave-type-criteria.service';
import { LeaveTypeCriteriaController } from './leave-type-criteria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveTypeCriteria])],
  providers: [LeaveTypeCriteriaService],
  controllers: [LeaveTypeCriteriaController],
})
export class LeaveTypeCriteriaModule {}
