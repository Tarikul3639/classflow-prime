import {
    IsBoolean,
    IsOptional,
    IsString,
    MaxLength,
    ValidateIf,
} from 'class-validator';

export class BlockAdminClassDto {
    @IsBoolean()
    isBlocked!: boolean;

    @ValidateIf((dto) => dto.isBlocked === true)
    @IsString()
    @MaxLength(500)
    blockedReason?: string;
}