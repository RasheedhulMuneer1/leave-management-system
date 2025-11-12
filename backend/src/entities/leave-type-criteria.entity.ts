import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LeaveTypeCriteria{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    leaveType! : string;

    @Column()
    minServiceYears!: number;

    @Column()
    maxPerYear!: number;

    @Column( {default: true})
    carryOver: boolean;

    @Column({type: 'date'})
    date: Date;

    @Column({default: true})
    approvalRequired: boolean;

   

}
