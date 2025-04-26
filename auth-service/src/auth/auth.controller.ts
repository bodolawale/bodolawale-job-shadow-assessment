import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from './dto/register';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ServiceDto } from '../types/service.types';
import { VerifyTokenDto } from './dto/verify-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(
    @Payload() registerDto: RegisterDto,
  ): Promise<{ user: User; token: string }> {
    return this.authService.register(registerDto);
  }

  @MessagePattern('login')
  async login(
    @Payload() loginDto: LoginDto,
  ): Promise<{ user: User; token: string }> {
    return this.authService.login(loginDto);
  }

  @MessagePattern('verifyToken')
  async verifyToken(@Payload() verifyTokenDto: VerifyTokenDto) {
    return this.authService.verifyToken(verifyTokenDto.token);
  }
}
