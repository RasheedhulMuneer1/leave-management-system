import { IsOptional, IsString } from 'class-validator';

export class UpdateLeaveApplicationDto {
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

  @IsOptional()
  @IsString()
  reasonForLeave?: string;

  @IsOptional()
  @IsString()
  addressDuringLeave?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;
}

