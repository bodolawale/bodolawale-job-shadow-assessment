import { idPayloadDto } from './../types/idPayload';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, FindAllUsersDto } from './dto/create-user.dto';
import { User, UserEntity } from './entities/user.entity';
import { UserByEmail } from './dto/user-by-email.dto';
import { ServiceDto } from '../types/service.types';
import { FindUserById } from './dto/find-by-id.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('findAllUsers')
  findAll(@Payload() findAllUsersDto: ServiceDto<FindAllUsersDto>): User[] {
    return this.usersService.findAll(findAllUsersDto);
  }

  @MessagePattern('findUserById')
  findById(@Payload() findByIdDto: ServiceDto<FindUserById>): User | null {
    return this.usersService.findById(
      findByIdDto.callerUser,
      findByIdDto.user_id,
    );
  }

  @MessagePattern('getUserByIdForAuth')
  getUserByIdForAuth(
    @Payload() idPayload: ServiceDto<idPayloadDto>,
  ): User | null {
    return this.usersService.getUserByIdForAuth(
      idPayload.id,
      idPayload.tenant_id,
    );
  }

  @MessagePattern('findUserByEmailForLogin')
  findUserByEmailForLogin(
    @Payload() userByEmail: UserByEmail,
  ): UserEntity | null {
    return this.usersService.findUserByEmailForLogin(
      userByEmail.email,
      userByEmail.tenant_id,
    );
  }
}
