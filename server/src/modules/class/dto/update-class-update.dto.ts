// update-class-update.dto.ts

import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateClassUpdateRequestDto } from './create-class-update.dto';
import { FetchSingleClassUpdateResponseDto } from './fetch-single-class-update.dto';

// Convert to UpdateClassUpdateRequestDto with all fields optional + isPinned field added for pinning/unpinning the update
export class UpdateClassUpdateRequestDto extends PartialType(
    OmitType(CreateClassUpdateRequestDto, [] as const),
) {
    @ApiProperty({
        example: true,
        description: 'Pin or unpin the update',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isPinned?: boolean;
}

// Response DTO can be same as FetchSingleClassUpdateResponseDto since we are returning the updated update details after update operation
export class UpdateClassUpdateResponseDto extends FetchSingleClassUpdateResponseDto { }