export type Role = 'ADMIN' | 'USER';
export class CreateUserDto {
  role: Role;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export class FindAllUsersDto {
  tenant_id: string;
  role?: Role;
}
