import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(userName);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.password.trim() !== password.trim()) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

async login(userName: string, password: string) {
  const user = await this.validateUser(userName, password);

  const payload = {
    sub: user.id,
    username: user.userName, 
    name: user.name,         
    role: user.role?.roleName || 'User',
  };

  const token = this.jwtService.sign(payload);

  return {
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.userName,
      name: user.name, 
      role: user.role?.roleName || 'User',
    },
  };
}

}
