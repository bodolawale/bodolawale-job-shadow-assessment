import { Injectable } from '@nestjs/common';
import { CreateUserDto, FindAllUsersDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { User, UserEntity } from './entities/user.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto): User {
    const exists = this.usersRepository.findByEmail(
      createUserDto.email,
      createUserDto.tenant_id,
    );
    if (exists) throw new RpcException('Email has already been taken');
    return this.usersRepository.create(createUserDto);
  }

  findAll(findAllUsersDto: FindAllUsersDto): User[] {
    return this.usersRepository.findAll(findAllUsersDto);
  }

  findById(callerUser: User, id: number): User {
    if (callerUser.role != 'ADMIN' && callerUser.id !== id) {
      throw new RpcException('You are not authorized to view this user');
    }
    const user = this.usersRepository.findById(id, callerUser.tenant_id);
    if (!user) throw new RpcException('User Not Found');
    return user;
  }

  getUserByIdForAuth(id: number, tenantId: string): User | null {
    return this.usersRepository.findById(id, tenantId);
  }

  findUserByEmailForLogin(email: string, tenant_id: string): UserEntity | null {
    return this.usersRepository.findByEmailForLogin(email, tenant_id);
  }
}
