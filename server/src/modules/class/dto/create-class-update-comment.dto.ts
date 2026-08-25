import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/* ── Request DTO ─────────────────────────────────────────────── */

export class CreateClassUpdateCommentRequestDto {
  @ApiProperty({
    example: 'Thanks for sharing this update!',
    description: 'The content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  message!: string;
}

/* ── Nested Comment DTO ──────────────────────────────────────── */

export class ClassUpdateCommentDto {
  @ApiProperty({
    example: 'comment-id',
  })
  @IsString()
  _id!: string;

  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Thanks for sharing this update!',
  })
  @IsString()
  message!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  isOwner!: boolean;

  @ApiProperty({
    example: '2026-08-25T10:00:00.000Z',
  })
  @IsDateString()
  createdAt!: Date;
}

/* ── Nested Data DTO ─────────────────────────────────────────── */

export class CreateClassUpdateCommentDataDto {
  @ApiProperty({
    type: () => ClassUpdateCommentDto,
  })
  @ValidateNested()
  @Type(() => ClassUpdateCommentDto)
  comment!: ClassUpdateCommentDto;
}

/* ── Response DTO ────────────────────────────────────────────── */

export class CreateClassUpdateCommentResponseDto {
  @ApiProperty({
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    example: 'Comment created successfully',
  })
  message!: string;

  @ApiProperty({
    type: () => CreateClassUpdateCommentDataDto,
  })
  @ValidateNested()
  @Type(() => CreateClassUpdateCommentDataDto)
  data!: CreateClassUpdateCommentDataDto;
}