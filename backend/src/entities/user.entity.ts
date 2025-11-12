import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Role } from './role.entity.js';
import { Establishment } from './establishment.entity.js';
import { Leave } from './leave.entity.js';
import { LeaveApprovalFlow } from './leave-approval-flow.entity.js';
import { LeaveApplication } from './leave-application.entity.js';

@Entity() // @Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name!: string;


    @Column()
    nic!: string;

    @OneToMany( () => Role, (role) => role.users, { eager: true })
    role: Role;

    @Column( { default: true })  
    status: boolean;

    @ManyToOne( () => Establishment, (est) => est.users, { nullable: true, eager: true})
    establishment: Establishment | null;

    
    @Column( {type: 'date', nullable: true })
    activeFrom: Date | null;

    @Column( {type: 'date', nullable: true })
    activeTo: Date | null;

    // leaves created by the user (leave applicant)
    @OneToMany(() => Leave, (leave) => leave.applicant)
    leaves: Leave[];

    

    // leaves where this user acted as acting member
    @OneToMany(() => Leave, (leave) => leave.actingMember)
    actingForLeaves: Leave[];

    @OneToMany(()=> LeaveApprovalFlow, (flow) => flow.approver)
    approvals: LeaveApprovalFlow[];

    @CreateDateColumn()
    createdAt: Date;


    @CreateDateColumn()
    updatedAt: Date;

   
}

// note: @OneToMany, @ManyToOne etc.. are not stored as columns in the user table in db
//  instead of @ManyToOne it creates a foreign key column like "establishmentId"
// instead of @OneToMany it doens't create a column, the foreign key is stored in the other table like "leave.user.Id"