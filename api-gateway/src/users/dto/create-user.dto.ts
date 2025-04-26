export type UserRole = 'ADMIN' | 'USER';

export class CreateUserDto {
  role: UserRole;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
