import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Controller, Post, Get, Param, Body, Delete, Patch, Req, UseGuards } from '@nestjs/common';
import { LeaveApplicationsService } from './leave-applications.service.js';
import { CreateLeaveApplicationDto } from './create-leave-application.dto.js';
import { UpdateLeaveApplicationDto } from './update-leave-application.dto.js';

@Controller('leave-applications')
export class LeaveApplicationsController {
  constructor(private readonly service: LeaveApplicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-leaves')
  async getMyLeaves(@Req() req) {
    const userId = req.user.id;
  }

  @UseGuards(JwtAuthGuard)
  @Get('acting-member')
  async getActingMemberLeaves(@Req() req) {
    const userName = req.user.name;
    return this.service.findByActingMember(userName);
  }

  @Post()
  async create(@Body() dto: CreateLeaveApplicationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateLeaveApplicationDto) {
    return this.service.update(id, dto);
  }
}
