import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity.js";
import { Establishment } from "./establishment.entity.js";

@Entity()
export class LeaveApplicationForExternalForwarding{
    @PrimaryGeneratedColumn()
    id!: number; 

    @Column()
    applicationId!: number;     

    @Column()
    applicantName!: string;
 
    @Column()
    nic!: string;

    @ManyToOne(() => Establishment, (est) => est.users, {nullable: true, eager: true })
    currentEstablishment: Establishment | null;
    
    @ManyToOne(() => Role, (est) => est.users, {nullable: true, eager: true })
    attacheduserRole: Role | null;

    @Column()
    rank!: string;

    @Column()
    leaveType!: string;

    @Column({type: 'date'})
    period: Date;
    
    @Column()
    days: number;


    

}