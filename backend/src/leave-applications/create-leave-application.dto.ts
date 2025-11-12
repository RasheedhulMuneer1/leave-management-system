import { IsNotEmpty, IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeaveApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nic: string;

  @IsString()
  @IsNotEmpty()
  rank: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  attachedUserRoleId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  currentEstablishmentId: number;

  @IsString()
  @IsNotEmpty()
  leaveType: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfFirstAppointment: string;

  @IsDateString()
  @IsNotEmpty()
  leaveStartDate: string;

  @IsDateString()
  @IsNotEmpty()
  leaveEndDate: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  numberOfDays: number;

  @IsString()
  @IsNotEmpty()
  actingMember: string;

  @IsString()
  @IsNotEmpty()
  reasonForLeave: string;

  @IsString()
  @IsNotEmpty()
  addressDuringLeave: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsOptional()
  @IsString()
  actingMemberStatus?: string;

  @IsOptional()
  @IsString()
  actingMemberRemarks?: string;

  @IsOptional()
  @IsString()
  leaveApproveMemberRemarks?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
