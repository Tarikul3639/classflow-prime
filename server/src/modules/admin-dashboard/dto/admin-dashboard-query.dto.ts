import { Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    Max,
    Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AdminDashboardQueryDto {

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20)
    @ApiPropertyOptional({
        description: 'The maximum number of recent users to retrieve (default: 5, min: 1, max: 20)',
        example: 5,
    })
    recentUsersLimit: number = 5;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20)
    @ApiPropertyOptional({
        description: 'The maximum number of recent classes to retrieve (default: 5, min: 1, max: 20)',
        example: 5,
    })
    recentClassesLimit: number = 5;
}