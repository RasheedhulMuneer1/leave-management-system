import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Establishment } from "./establishment.entity.js";
import { Role } from "./role.entity.js";


@Entity()
export class ServiceMembersReport {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    rank!: string;

    @Column()
    name!: string;

    @Column()
    nic!: string

    @ManyToOne(() => Establishment, (est) => est.users, {nullable: true, eager: true })
    currentEstablishment: Establishment | null;

    @ManyToOne(() => Role, (est) => est.users, {nullable: true, eager: true })
    attachedUserRole: Role | null;

    @Column()
    actions: string;
}
