import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveApplication } from '../entities/leave-application.entity';
import { CreateLeaveApplicationDto } from './create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './update-leave-application.dto';
import { Role } from '../entities/role.entity';
import { Establishment } from '../entities/establishment.entity';

@Injectable()
export class LeaveApplicationsService {
  constructor(
    @InjectRepository(LeaveApplication)
    private readonly repo: Repository<LeaveApplication>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(Establishment)
    private readonly estRepo: Repository<Establishment>,
  ) {}


async create(data: CreateLeaveApplicationDto) {
  if (!data.attachedUserRoleId) throw new BadRequestException('Missing Role ID');
  const role = await this.roleRepo.findOne({ where: { id: data.attachedUserRoleId } });
  if (!role) throw new BadRequestException('Invalid Role ID');

  if (!data.currentEstablishmentId) throw new BadRequestException('Missing Establishment ID');
  const est = await this.estRepo.findOne({ where: { id: data.currentEstablishmentId } });
  if (!est) throw new BadRequestException('Invalid Establishment ID');

  const leave = this.repo.create({
    name: data.name,
    nic: data.nic,
    rank: data.rank,
    leaveType: data.leaveType,
    dateOfFirstAppointment: new Date(data.dateOfFirstAppointment),
    leaveStartDate: new Date(data.leaveStartDate),
    leaveEndDate: new Date(data.leaveEndDate),
    numberOfDays: data.numberOfDays,
    actingMember: data.actingMember,
    reasonForLeave: data.reasonForLeave,
    addressDuringLeave: data.addressDuringLeave,
    contactNumber: data.contactNumber,

    attacheduserRoleId: role.id,

    attachedUserRole: role,

    currentEstablishmentId: est.id,
    currentEstablishment: est,

    actingMemberStatus: data.actingMemberStatus || 'Pending',
    actingMemberRemarks: data.actingMemberRemarks || null,
    leaveApproveMemberRemarks: data.leaveApproveMemberRemarks || null,
    status: data.status || 'Pending',
  } as Partial<LeaveApplication>);

  return await this.repo.save(leave);
}



// find

  findAll() {
    return this.repo.find({ relations: ['attachedUserRole', 'currentEstablishment'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['attachedUserRole', 'currentEstablishment'],
    });
  }

  async findByActingMember(name: string) {
    return this.repo.find({
      where: { actingMember: name },
      relations: ['attachedUserRole', 'currentEstablishment'],
    });
  }



  //  remove
  async remove(id: number) {
    const leave = await this.repo.findOne({ where: { id } });
    if (!leave) throw new NotFoundException(`Leave application with ID ${id} not found`);

    await this.repo.remove(leave);
    return { message: `Leave application with ID ${id} removed successfully` };
  }





  // update
  async update(id: number, dto: UpdateLeaveApplicationDto) {
    const leave = await this.repo.findOne({ where: { id } });
    if (!leave) throw new NotFoundException(`Leave application with ID ${id} not found`);

    if (dto.actingMemberStatus !== undefined) leave.actingMemberStatus = dto.actingMemberStatus;
    if (dto.actingMemberRemarks !== undefined) leave.actingMemberRemarks = dto.actingMemberRemarks;
    if (dto.status !== undefined) leave.status = dto.status;
    if (dto.leaveApproveMemberRemarks !== undefined) leave.leaveApproveMemberRemarks = dto.leaveApproveMemberRemarks;
    if (dto.reasonForLeave !== undefined) leave.reasonForLeave = dto.reasonForLeave;
    if (dto.addressDuringLeave !== undefined) leave.addressDuringLeave = dto.addressDuringLeave;
    if (dto.contactNumber !== undefined) leave.contactNumber = dto.contactNumber;

    return await this.repo.save(leave);
  }
}
