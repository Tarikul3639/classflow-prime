import { UserRole } from '../../../infrastructure/database/interface/user.interface';

export class AdminDashboardUserDto {
    id!: string;
    name!: string;
    email!: string;
    role!: UserRole;
    emailVerified!: boolean;
    avatarUrl!: string | null;
    createdAt!: Date;
}