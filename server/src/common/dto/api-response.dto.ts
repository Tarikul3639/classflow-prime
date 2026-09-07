import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
    @ApiProperty({
        example: true,
        description: 'Indicates whether the request was successful',
    })
    success!: boolean;

    @ApiProperty({
        example: 'Request completed successfully',
        nullable: true,
        description: 'Response message',
    })
    message!: string | null;

    @ApiProperty({
        example: null,
        nullable: true,
        description: 'Additional status information',
    })
    status!: number | string | null;

    data!: T;
}