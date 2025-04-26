import { IsEmail, IsEnum, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['ADMIN', 'USER'])
  role: 'ADMIN' | 'USER';
}
