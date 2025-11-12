import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';


export class CreateLeaveTypeDto {
  @IsString() 
  @IsNotEmpty()
  leaveType: string; 

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  maxDays!: number;

  @IsNumber()
  @IsOptional()
  status?: number = 1; // default value = 1 (active)

  @IsString()
  @IsOptional()
  createdDate?: string;
}
