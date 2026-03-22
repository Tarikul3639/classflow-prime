import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

/**
 * Request DTO for joining a class
 */
export class JoinClassRequestDto {
    @ApiProperty({
        example: "ABC123",
        description: "6-character join code for the class",
    })
    @IsString()
    @IsNotEmpty({ message: "Join code is required" })
    @Length(6, 6, { message: "Join code must be exactly 6 characters" })
    joinCode: string;
}

/**
 * Nested data object for the response
 */
class JoinClassDataDto {
    @ApiProperty({
        example: "65f1a2b3c4d5e6f7a8b9c0d1",
        description: "The unique ID of the class, or null if join failed",
        nullable: true,
    })
    @IsOptional()
    @IsString()
    classId: string | null;
}

/**
 * Response DTO for joining a class
 */
export class JoinClassResponseDto {
    @ApiProperty({
        example: true,
        description: "Indicates if the join operation was successful",
    })
    @IsBoolean()
    success: boolean;

    @ApiProperty({
        example: "Successfully joined the class",
        description: "Message providing additional information",
    })
    @IsString()
    message: string;

    @ApiProperty({
        description: "Data returned upon joining",
        type: JoinClassDataDto,
    })
    @ValidateNested()
    @Type(() => JoinClassDataDto)
    data: JoinClassDataDto;
}