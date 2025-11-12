import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Establishment } from '../entities/establishment.entity';
import { Users } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(Establishment)
    private readonly estbRepo: Repository<Establishment>,
  ) {}
async findByUsername(userName: string): Promise<any> {
  try {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('LOWER(user.userName) = LOWER(:username)', { username: userName })
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.establishment', 'establishment')
      .getOne();

    if (!user) return null;

   // keep full role and estb objects
    return {
      ...user,
      role: user.role ? { id: user.role.id, name: user.role.name } : null,
      establishment: user.establishment ? { id: user.establishment.id, name: user.establishment.name } : null,
    };
  } catch (err) {
    console.error('Error fetching user by username:', err);
    throw new InternalServerErrorException('Failed to fetch user');
  }
}





// fetch all users

  async findAll(): Promise<Users[]> {
    return this.userRepo.find({ relations: ['role', 'establishment'] });
  }


// fetch single user by id
  async findOne(id: number): Promise<Users> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role', 'establishment'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }


  // create new user with hashed pw
  async create(userData: any): Promise<Users> {
    try {
      if (!userData.roleId) throw new NotFoundException('Role is required');

      const role = await this.roleRepo.findOne({ where: { id: userData.roleId } });
      if (!role) throw new NotFoundException(`Role ID ${userData.roleId} not found`);

      let establishment: Establishment | undefined;
      if (userData.establishmentId) {
        const estb = await this.estbRepo.findOne({ where: { id: userData.establishmentId } });
        if (!estb) throw new NotFoundException(`Establishment ID ${userData.establishmentId} not found`);
        establishment = estb;
      }

      
      const rankLower = userData.rank || '';



  

      const newUser = this.userRepo.create({
        name: userData.name,
        rank: userData.rank,
        nic: userData.nic,
        userName: userData.userName,
        password: userData.password,
        actions: userData.actions ?? 'N/A',
        status: userData.status ?? true,
        activeFrom: userData.activeFrom ?? undefined,
        activeTo: userData.activeTo ?? undefined,
        role,
        establishment,
      });

      return await this.userRepo.save(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }



  // update existing user
  async update(id: number, updateData: any): Promise<Users> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role', 'establishment'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (updateData.roleId) {
      const role = await this.roleRepo.findOne({ where: { id: updateData.roleId } });
      if (!role) throw new NotFoundException(`Role ID ${updateData.roleId} not found`);
      user.role = role;
    }

    if (updateData.establishmentId) {
      const estb = await this.estbRepo.findOne({ where: { id: updateData.establishmentId } });
      if (!estb) throw new NotFoundException(`Establishment ID ${updateData.establishmentId} not found`);
      user.establishment = estb;
    }

    user.name = updateData.name ?? user.name;
    user.rank = updateData.rank ?? user.rank;
    user.nic = updateData.nic ?? user.nic;
    user.userName = updateData.userName ?? user.userName;

   
    user.password = updateData.password ?? user.password;

    user.status = updateData.status ?? user.status;
    user.actions = updateData.actions ?? user.actions ?? 'N/A';
    if (updateData.activeFrom) user.activeFrom = new Date(updateData.activeFrom);
    if (updateData.activeTo) user.activeTo = new Date(updateData.activeTo);

    try {
      return await this.userRepo.save(user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }




// remove user
  async remove(id: number): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
