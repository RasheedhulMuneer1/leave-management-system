import { Entity, Column, ManyToOne, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { Leave } from "./leave.entity.js";
import { User } from "./user.entity.js";


@Entity()
export class LeaveApprovalFlow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Leave, (leave) => leave.approvalFlows, { onDelete: 'CASCADE' })
    leave: Leave;

    @ManyToOne(() => User, (user) => user.approvals, { eager: true })
    approver: User;

    @Column({ nullable: true, type: 'varchar2', length: 50 })
    action: string; 

    @Column({ nullable: true, type: 'clob' })
    remarks: string | null;

    @CreateDateColumn()
    actionedAt: Date;
}
