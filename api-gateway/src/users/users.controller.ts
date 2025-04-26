import { Roles } from './../decorators/role.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ProxyService } from '../proxy';
import { MICROSERVICES, USER_ROLES } from '../types/application.types';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(ProxyService) private readonly proxyService: ProxyService,
  ) {}

  @SkipThrottle({ short: true })
  @Get()
  @Roles(USER_ROLES.ADMIN)
  async getAllUsers(@Req() req: Request, @Body() body: CreateUserDto) {
    const response = await this.proxyService.send(
      req,
      body,
      MICROSERVICES.USER_SERVICE,
      'findAllUsers',
    );

    return { message: 'Users fetched successfully', data: response };
  }

  @Get('/:id')
  async getUserById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.proxyService.send(
      req,
      { user_id: id },
      MICROSERVICES.USER_SERVICE,
      'findUserById',
    );
    return { message: 'User fetched successfully', data: response };
  }
}
