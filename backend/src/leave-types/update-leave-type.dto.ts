import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveTypeDto } from './create-leave-type.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';


export class UpdateLeaveTypeDto extends PartialType(CreateLeaveTypeDto) {
  @IsOptional()
  @IsString()
  leaveType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  maxDays?: number;

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsString()
  createdDate?: string; 
}
