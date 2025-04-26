import { User } from './../users/entities/user.entity';
export type ServiceDto<T> = T & { tenant_id: string; callerUser: User };
