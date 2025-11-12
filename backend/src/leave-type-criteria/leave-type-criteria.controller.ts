import { Controller, Post, Get, Delete, Put, Body, Param, NotFoundException } from '@nestjs/common';
import { LeaveTypeCriteriaService } from './leave-type-criteria.service';
import { CreateLeaveTypeCriteriaDto } from './create-leave-type.criteria.dto';

@Controller('leave-type-criteria')
export class LeaveTypeCriteriaController {
  constructor(private service: LeaveTypeCriteriaService) {}




  // get all leave type criteria
  @Get()
  getAll() {
    return this.service.findAll();
  }


  // create new leave type criteria
  @Post()
  create(@Body() dto: CreateLeaveTypeCriteriaDto) {
    return this.service.create(dto);
  }

  // update existing leave type criteria
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: CreateLeaveTypeCriteriaDto) {
    const updated = await this.service.update(id, dto);
    if (!updated) throw new NotFoundException(`Criteria with ID ${id} not found`);
    return updated;
  }

  

  // delete criteria by ID
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
