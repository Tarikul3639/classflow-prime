import { UserRole } from '../../../infrastructure/database/interface/user.interface';

export class AdminDashboardUserDto {
    id!: string;
    name!: string;
    email!: string;
    role!: UserRole;
    status!: string;
    emailVerified!: boolean;
    avatarUrl!: string | null;
    createdAt!: Date;
}