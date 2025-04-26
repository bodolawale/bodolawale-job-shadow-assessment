export type UserEntity = {
  id: number;
  role: 'ADMIN' | 'USER';
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type User = Omit<UserEntity, 'password'>;
