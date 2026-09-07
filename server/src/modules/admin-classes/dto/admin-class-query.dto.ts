import { Transform } from 'class-transformer';
import {
    IsEnum,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { ClassStatus } from '../../../infrastructure/database/interface/class.interface';

export class AdminClassQueryDto {
    @ApiPropertyOptional({
        description: 'Page number for pagination (default: 1)',
        example: 1,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description:
            'Number of items per page for pagination (default: 10, max: 100)',
        example: 10,
    })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Search term to filter classes by name or department',
        example: 'Math',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter classes by status (active, ended, upcoming)',
        example: 'active',
        enum: ClassStatus,
        enumName: 'ClassStatus',
    })
    @IsOptional()
    @IsEnum(ClassStatus)
    status?: ClassStatus;

    @ApiPropertyOptional({
        description: 'Sort classes by a specific field (default: createdAt)',
        example: 'className',
    })
    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional({
        description: 'Sort order for the results (asc or desc, default: desc)',
        example: 'desc',
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';
}
