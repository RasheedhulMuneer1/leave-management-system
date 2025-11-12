import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  async login(@Body() body: { userName: string; password: string }) {
    const { userName, password } = body;
    return this.authService.login(userName, password);
  }
}
