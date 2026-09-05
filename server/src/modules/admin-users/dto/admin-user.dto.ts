import { UserRole } from '../../../infrastructure/database/interface/user.interface';
import { UserStatus } from '../../../infrastructure/database/interface/user.interface';

export class AdminUserDto {
  id!: string;
  name!: string;
  email!: string;
  role!: UserRole;
  emailVerified!: boolean;
  avatarUrl!: string | null;
  bio?: string;
  status!: UserStatus
  createdAt!: Date;
  updatedAt!: Date;
}