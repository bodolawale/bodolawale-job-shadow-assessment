import { MICROSERVICES } from '../types/application.types';

import { ProxyService } from './../proxy';
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(ProxyService) private readonly proxyService: ProxyService,
  ) {}

  @Public()
  @Post('/register')
  async register(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: RegisterDto,
  ) {
    const response = await this.proxyService.send(
      req,
      body,
      MICROSERVICES.AUTH_SERVICE,
      'register',
    );

    res.json({ message: 'Registration Successful', data: response });
  }

  @Public()
  @Post('/login')
  @HttpCode(200)
  async login(@Req() req: Request, @Body() body: LoginDto) {
    const response = await this.proxyService.send(
      req,
      body,
      MICROSERVICES.AUTH_SERVICE,
      'login',
    );

    return { message: 'Login Successful', data: response };
  }
}
