import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Current page number',
    })
    page!: number;

    @ApiProperty({
        example: 10,
        description: 'Number of items per page',
    })
    limit!: number;

    @ApiProperty({
        example: 100,
        description: 'Total number of items',
    })
    total!: number;

    @ApiProperty({
        example: 10,
        description: 'Total number of pages',
    })
    totalPages!: number;
}
