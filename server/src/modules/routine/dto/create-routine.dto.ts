// create-routine.dto.ts

import { Type } from 'class-transformer';

import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';

import { GetRoutineResponseDto } from './get-routine.dto';

//
// PERIOD INPUT DTO
//

export class PeriodDto {
    @IsNumber()
    @Min(1)
    periodNo!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    label!: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'startTime must be HH:mm format',
    })
    startTime!: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'endTime must be HH:mm format',
    })
    endTime!: string;

    @IsOptional()
    @IsBoolean()
    isBreak?: boolean;
}

//
// CREATE ROUTINE DTO
//

export class CreateRoutineDto {
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PeriodDto)
    periods!: PeriodDto[];
}

//
// RESPONSE DTO
//

export class CreateRoutineResponseDto extends GetRoutineResponseDto {}