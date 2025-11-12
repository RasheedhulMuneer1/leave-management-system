import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { User } from './user.entity.js';

@Entity()
export class Establishment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name!: string;

    @OneToMany( () => User, (user) => user.establishment)
    users: User[];

}