import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveTypeCriteria } from '../entities/leave-type-criteria.entity';
import { CreateLeaveTypeCriteriaDto } from './create-leave-type.criteria.dto';

@Injectable()
export class LeaveTypeCriteriaService {
  constructor(
    @InjectRepository(LeaveTypeCriteria)
    private repo: Repository<LeaveTypeCriteria>,
  ) {}

  // create a new record
  async create(dto: CreateLeaveTypeCriteriaDto) {
    const criteria = this.repo.create(dto);
    return this.repo.save(criteria);
  }

  // fetch all the records
  findAll() {
    return this.repo.find();
  }

  


  // update existing record
  async update(id: number, dto: CreateLeaveTypeCriteriaDto) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Criteria with ID ${id} not found`);
    }

    Object.assign(existing, dto);
    return this.repo.save(existing);
  }



  // delete record by id
  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Criteria with ID ${id} not found`);
    }
    return { message: `Criteria with ID ${id} deleted successfully` };
  }
}
