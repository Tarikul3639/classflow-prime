import { ClassStatus } from '../../../infrastructure/database/interface/class.interface';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

export class AdminClassCreatorDto {
    _id!: string;
    name!: string;
    email!: string;
    avatarUrl!: string | null;
}

export class AdminClassDto {
    _id!: string;
    className!: string;
    enrollCode!: string;
    department?: string;
    semester?: string;
    themeColor!: string;
    coverImage?: string | null;
    status!: ClassStatus;
    allowEnroll!: boolean;
    isBlocked!: boolean;
    blockedReason?: string | null;

    // ============================
    // CLASS CREATOR
    // ============================
    createdBy?: AdminClassCreatorDto | null;

    // ============================
    // TIMESTAMPS
    // ============================
    createdAt!: Date;
    updatedAt!: Date;

    // ============================
    // MEMBER STATS
    // ============================
    totalMembers!: number;
    totalTeachers!: number;
    totalLearners!: number;
}

export type AdminClassesDto = ApiResponseDto<{
    classes: AdminClassDto[];
    pagination: PaginationResponseDto;
}>;