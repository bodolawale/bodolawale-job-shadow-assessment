import { Injectable } from '@nestjs/common';
import { CreateUserDto, FindAllUsersDto } from './dto/create-user.dto';
import { User, UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  private users: UserEntity[] = [
    // tenant_1 users
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      tenant_id: 'tenant_1',
      email: 'john.doe@gmail.com',
      password: '$2b$10$KwHC7HLIhCUSF7R7yCNc7uzvOQuDH2UvPlY/R7VZ7vh370wGQ.0aG',
      role: 'ADMIN',
    },
    {
      id: 2,
      first_name: 'James',
      last_name: 'Andrew',
      tenant_id: 'tenant_1',
      email: 'james.andrew@gmail.com',
      password: '$2b$10$KwHC7HLIhCUSF7R7yCNc7uzvOQuDH2UvPlY/R7VZ7vh370wGQ.0aG',
      role: 'USER',
    },

    // tenant_2 users
    {
      id: 3,
      first_name: 'Ayodele',
      last_name: 'Akinwale',
      tenant_id: 'tenant_2',
      email: 'ayodele.akinwale@gmail.com',
      password: '$2b$10$KwHC7HLIhCUSF7R7yCNc7uzvOQuDH2UvPlY/R7VZ7vh370wGQ.0aG',
      role: 'ADMIN',
    },
    {
      id: 4,
      first_name: 'Omolola',
      last_name: 'Oyeniran',
      tenant_id: 'tenant_2',
      email: 'omolola.oyeniran@gmail.com',
      password: '$2b$10$KwHC7HLIhCUSF7R7yCNc7uzvOQuDH2UvPlY/R7VZ7vh370wGQ.0aG',
      role: 'USER',
    },
  ];

  private getMaxUserId(): number {
    return this.users.length > 0
      ? Math.max(...this.users.map((user) => user.id))
      : 0;
  }

  private toUserDetails(user: UserEntity): User {
    const { password, ...userDetails } = user;
    return userDetails;
  }

  create(createUserDto: CreateUserDto): User {
    const userId = this.getMaxUserId() + 1;
    const newUser = { ...createUserDto, id: userId };
    this.users.push(newUser);
    console.log(`Created User ===>`, newUser);
    return this.toUserDetails(newUser);
  }

  findAll(findAllUsersDto: FindAllUsersDto): User[] {
    const users = this.users.filter((u) => {
      return (
        u.tenant_id === findAllUsersDto.tenant_id &&
        (findAllUsersDto.role ? u.role === findAllUsersDto.role : true)
      );
    });
    return users.map((user) => this.toUserDetails(user));
  }

  findByEmail(email: string, tenant_id: string): User | null {
    return (
      this.users.find((u) => u.email === email && u.tenant_id === tenant_id) ??
      null
    );
  }

  findById(id: number, tenantId: string): User | null {
    const user = this.users.find(
      (user) => user.id === id && user.tenant_id == tenantId,
    );
    return user ? this.toUserDetails(user) : null;
  }

  findByEmailForLogin(email: string, tenant_id: string): UserEntity | null {
    const user = this.users.find((u) => {
      return u.email === email && u.tenant_id === tenant_id;
    });
    return user ?? null;
  }
}
