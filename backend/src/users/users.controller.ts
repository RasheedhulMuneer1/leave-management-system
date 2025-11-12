import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '../entities/users.entity';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  // get all users
  @Get()
  getAllUsers(): Promise<Users[]> {
    return this.usersService.findAll();
  }


  // get user by username (case-insensitive)
  @Get('username/:username')
  async getUserByUsername(@Param('username') username: string): Promise<Users> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    return user;
  }





  // get single user by id
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<Users> {
    return this.usersService.findOne(id);
  }

  // get current logged in user
  @Get('me')
  async getCurrentUser(@Req() req: Request): Promise<Users> {
    const userId = req.user?.id;
    if (!userId) {
      throw new NotFoundException('Current user not found');
    }
    return this.usersService.findOne(userId);
  }

  

  // create user
  @Post()
  createUser(@Body() body: Partial<Users>): Promise<Users> {
    return this.usersService.create(body);
  }

  

  // update user (PATCH)
  @Patch(':id')
  patchUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.update(id, body);
  }



  // update user (PUT)
  @Put(':id')
  putUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.update(id, body);
  }



  // delete user
  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
