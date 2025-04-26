export type Role = 'ADMIN' | 'USER';
export class RegisterDto {
  role: Role;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
