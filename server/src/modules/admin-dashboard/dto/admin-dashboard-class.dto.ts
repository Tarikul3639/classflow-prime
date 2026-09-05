import { ClassStatus } from '../../../infrastructure/database/interface/class.interface';

export class AdminDashboardClassDto {
    id!: string;
    className!: string;
    department?: string;
    semester?: string;
    themeColor!: string;
    coverImage!: string | null;
    status!: ClassStatus;
    allowEnroll!: boolean;
    createdAt!: Date;
}