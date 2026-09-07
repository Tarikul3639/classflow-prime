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

import { ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole } from '../../../infrastructure/database/interface/user.interface';
import { UserStatus } from '../../../infrastructure/database/interface/user.interface';

export class AdminUserQueryDto {
    // ==================== Pagination ====================

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({
        description: 'Number of users per page for pagination',
        example: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;

    // ==================== Search ====================

    @ApiPropertyOptional({
        description: 'Search term for filtering users by name or email',
        example: 'john',
    })
    @IsOptional()
    @IsString()
    search?: string;

    // ==================== Filters ====================

    @ApiPropertyOptional({
        description: 'Filter users by role',
        enum: UserRole,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;


    @ApiPropertyOptional({
        description: 'Filter users by status',
        enum: UserStatus,
    })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @ApiPropertyOptional({
        description: 'Filter users by email verification status',
        example: true,
    })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    emailVerified?: boolean;

    // ==================== Sorting ====================

    @ApiPropertyOptional({
        description: 'Field to sort users by',
        example: 'createdAt',
        enum: ['createdAt', 'name', 'email'],
    })
    @IsOptional()
    @IsIn(['createdAt', 'name', 'email'])
    sortBy: string = 'createdAt';

    @ApiPropertyOptional({
        description: 'Sort order for users',
        example: 'desc',
        enum: ['asc', 'desc'],
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder: 'asc' | 'desc' = 'desc';
}