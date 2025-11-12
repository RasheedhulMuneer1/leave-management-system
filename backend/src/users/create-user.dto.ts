export class CreateUserDto {
  name: string;
  nic: string;
  userName: string;
  password: string;
  role: string;
  status: boolean;
  establishmentId?: number;
  activeFrom?: string;
  activeTo?: string;
} 
