import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Establishment } from "./establishment.entity.js";

@Entity()
export class EstablishmentAdmins{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

     @Column() 
      nic!: string;
    
      @Column({name: 'userName'})
      userName: string;
    
      @Column({name: 'password'})
      password: string;
    

    @ManyToOne(() => Establishment, (est) => est.users, {nullable: true, eager: true })
    establishment: Establishment | null;

    @Column( {default: true})
    status: boolean;

    
    @Column( {type: 'date', nullable: true})
    assignedDate : Date | null;

    @Column()
    actions: string; 
}