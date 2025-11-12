import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Establishment } from './establishment.entity';

@Entity('leave_application')
export class LeaveApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  nic: string;

  @Column({ length: 255 })
  rank: string;

  @Column({ length: 255 })
  leaveType: string;

  @Column({ type: 'date' })
  dateOfFirstAppointment: Date;

  @Column({ type: 'date' })
  leaveStartDate: Date;

  @Column({ type: 'date' })
  leaveEndDate: Date;

  @Column({ type: 'number' })
  numberOfDays: number;

  @Column({ length: 255 })
  actingMember: string;

  @Column({ length: 255 })
  reasonForLeave: string;

  @Column({ length: 255 })
  addressDuringLeave: string;

  @Column({ length: 20 })
  contactNumber: string;

  @Column({ name: 'attacheduserRoleId', type: 'number', nullable: true })
  attacheduserRoleId?: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'attacheduserRoleId' })
  attachedUserRole?: Role;

  @Column({ name: 'currentEstablishmentId', type: 'number', nullable: true })
  currentEstablishmentId?: number;

  @ManyToOne(() => Establishment)
  @JoinColumn({ name: 'currentEstablishmentId' })
  currentEstablishment?: Establishment;

  @Column({ length: 20, default: 'pending' })
  actingMemberStatus: string;

  @Column({ length: 400, nullable: true })
  actingMemberRemarks: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column({ length: 400, nullable: true })
  leaveApproveMemberRemarks: string;
}
