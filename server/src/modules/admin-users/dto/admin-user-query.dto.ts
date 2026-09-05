import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsEnum,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

import { UserRole } from '../../../infrastructure/database/interface/user.interface';
import { UserStatus } from '../../../infrastructure/database/interface/user.interface';

export class AdminUserQueryDto {
    // ==================== Pagination ====================

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;

    // ==================== Search ====================

    @IsOptional()
    @IsString()
    search?: string;

    // ==================== Filters ====================

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    emailVerified?: boolean;

    // ==================== Sorting ====================

    @IsOptional()
    @IsIn(['createdAt', 'name', 'email'])
    sortBy: string = 'createdAt';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder: 'asc' | 'desc' = 'desc';
}