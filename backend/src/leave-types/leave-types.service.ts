import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from '../entities/leave-type.entity.js';

@Injectable()
export class LeaveTypesService {
  constructor(
    @InjectRepository(LeaveType)
    private repo: Repository<LeaveType>,
  ) {}

  findAll() {
    return this.repo.find();
  }



  async create(data: Partial<LeaveType>) {
  console.log("Incoming DTO:", data); // log payload
  try {
    const leaveType = this.repo.create({
      ...data,
      status: data.status ?? 1, // fallback default
    });
    console.log("Entity before save:", leaveType);
    return await this.repo.save(leaveType);
  } catch (error) {
    console.error("DB Insert Error:", error);
    throw error;
  }
}

async  update(id: number, data: Partial<LeaveType>) {

  // prevents updated createdDate from frontend
  if ('createdDate' in data) delete (data as any).createdDate;

  const existing = await this.repo.findOne({ where: { id } });
  if (!existing) {
    throw new Error(`Leave type with ID ${id} not found`);
  }

  const updated = this.repo.merge(existing, data);
  return await this.repo.save(updated);
}


  remove(id: number) {
    return this.repo.delete(id);
  }
}
