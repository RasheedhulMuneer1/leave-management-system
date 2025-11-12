import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';   
import { Users } from './users.entity.js';

@Entity('roles') // roles
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true }) 
    name: string; // eg: Super Admin, System Admin, Estb Head, Estb Admin, Standard Member

    // one role can have many users
    @OneToMany(() => Users, (user) => user.role)
    users: Users[];
}
