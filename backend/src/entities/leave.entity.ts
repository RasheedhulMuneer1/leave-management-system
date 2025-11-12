import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity.js";
import { LeaveType } from "./leave-type.entity.js";
import { LeaveApprovalFlow } from "./leave-approval-flow.entity.js";



export type LeaveStatus = 'PENDING' | 'ACTING_CONFIRMED'| 'RECOMMENDED' | 'FORWARDED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

@Entity() 
export class Leave {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.leaves, { eager: true })
    applicant: User;

    @ManyToOne(() => LeaveType, { eager: true })
    leaveType: LeaveType;

    @Column({ type: 'date' })
    startDate: Date; 

    @Column({ type: 'date' })
    endDate: Date;

    @Column({ nullable: true })
    noOfDays: number;

    // Changed 'text' to 'clob' for Oracle compatibility
    @Column({ type: 'clob', nullable: true })
    reason: string;

    @ManyToOne(() => User, (user) => user.actingForLeaves, { nullable: true, eager: true })
    actingMember: User | null;

    @Column({ nullable: true })
    actingMemberConfirmed: boolean;

    @Column({ nullable: true })
    addressDuringLeave: string;

    @Column({ nullable: true })
    contactNo: string;

    @Column({ type: 'varchar2', length: 30, default: 'PENDING' })
    status: LeaveStatus;

    // Changed 'text' to 'clob' for Oracle compatibility
    @Column({ type: 'clob', nullable: true })
    remarks: string | null;

    @OneToMany(() => LeaveApprovalFlow, (flow) => flow.leave, { cascade: true })
    approvalFlows: LeaveApprovalFlow[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
