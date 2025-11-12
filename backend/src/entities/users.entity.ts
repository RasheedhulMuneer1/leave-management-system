import { 
  Column, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  JoinColumn 
} from 'typeorm';
import { Role } from './role.entity.js';
import { Establishment } from './establishment.entity.js';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rank: string;


  @Column() 
  nic!: string;

  @Column({name: 'userName'})
  userName: string;

  @Column({name: 'password'})
  password: string;

  


  // many users can have one role
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' }) // foreign key in db
  role: Role;

  @Column({ default: true })
  status: boolean;

  // many users can belong to one establishment
  @ManyToOne(() => Establishment, (est) => est.users, { nullable: true, eager: true })
  @JoinColumn({ name: 'establishmentId' })
  establishment?: Establishment;


  @Column({ type: 'timestamp' })
activeFrom: Date;

@Column({ type: 'timestamp' })
activeTo: Date;


  @Column()
  actions!: string;
}
