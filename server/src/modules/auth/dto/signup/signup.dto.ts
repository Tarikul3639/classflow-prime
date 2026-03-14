import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MinLength,
    MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SignUpDto {
    @ApiProperty({
        example: 'Tarikul Islam',
        description: 'Full name of the user',
    })
    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    @MinLength(2, { message: 'First name must be at least 2 characters' })
    @MaxLength(60, { message: 'First name must be at most 60 characters' })
    @Transform(({ value }) => value?.trim())
    firstName: string;

    @ApiPropertyOptional({
        example: 'Islam',
        description: 'Last name of the user',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    @MinLength(2, { message: 'Last name must be at least 2 characters' })
    @MaxLength(60, { message: 'Last name must be at most 60 characters' })
    @Transform(({ value }) => value?.trim())
    lastName: string;

    @ApiProperty({
        example: 'tarikul@example.com',
        description: 'User email address',
    })
    @IsEmail({}, { message: 'Please provide a valid email' })
    @IsNotEmpty({ message: 'Email is required' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @ApiProperty({
        example: 'StrongPass123',
        description: 'Account password',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;

    @ApiPropertyOptional({
        example: 'https://api.dicebear.com/7.x/avataaars/svg?seed=abc123',
        description: 'Avatar URL (optional)',
    })
    @IsOptional()
    @IsUrl({}, { message: 'avatarUrl must be a valid URL' })
    avatarUrl?: string;
}