import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('leave_type')
export class LeaveType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'leaveType', nullable: false })
  leaveType: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'maxDays', type: 'number', nullable: true })
  maxDays: number;


  @Column({ default: 1 })
  status: number;

  @Column({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

}
 