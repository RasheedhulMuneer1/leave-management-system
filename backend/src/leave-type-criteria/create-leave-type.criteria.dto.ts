import { IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateLeaveTypeCriteriaDto {
  @IsNotEmpty()
  @IsString()
  leaveType: string;

  @IsNumber()
  minServiceYears: number;

  @IsNumber()
  maxPerYear: number;

  @IsBoolean()
  carryOver: boolean;

  @IsBoolean()
  approvalRequired: boolean;

  @IsOptional()
  @IsString()
  actions: string;

  @IsOptional()
  date?: Date;
}
