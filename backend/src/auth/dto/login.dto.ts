import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  userName: string; // un entered by user

  @IsString()
  @IsNotEmpty()
  password: string; // pw entered by user
}
