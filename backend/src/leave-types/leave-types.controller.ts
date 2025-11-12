import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { LeaveTypesService } from './leave-types.service.js';
import { LeaveType } from '../entities/leave-type.entity.js';
import { CreateLeaveTypeDto } from './create-leave-type.dto.js';
import { UpdateLeaveTypeDto } from './update-leave-type.dto.js';
import { ParseIntPipe } from '@nestjs/common';

@Controller('leave-types')
export class LeaveTypesController {
  constructor(private leaveTypesService: LeaveTypesService) {}

  @Get()
  getAll() {
    return this.leaveTypesService.findAll();
  }




@Post()
create(@Body() dto: CreateLeaveTypeDto) {
  return this.leaveTypesService.create(dto);
}

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.leaveTypesService.remove(+id);
  }


@Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLeaveTypeDto,
  ) {
    return this.leaveTypesService.update(id, updateDto);
  }

}
