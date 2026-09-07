import { ApiProperty } from '@nestjs/swagger';

export class AdminUserStatsDto {
    @ApiProperty({
        description: 'Total number of users',
        example: 1000,
    })
    totalUsers!: number;

    @ApiProperty({
        description: 'Total number of verified users',
        example: 800,
    })
    verifiedUsers!: number;

    @ApiProperty({
        description: 'Total number of unverified users',
        example: 200,
    })
    unverifiedUsers!: number;

    @ApiProperty({
        description: 'Total number of admin users',
        example: 50,
    })
    adminUsers!: number;

    @ApiProperty({
        description: 'Total number of normal users',
        example: 950,
    })
    normalUsers!: number;
    
    @ApiProperty({
        description: 'Total number of banned users',
        example: 10,
    })
    bannedUsers!: number;
}
