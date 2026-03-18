import { IsEmail, IsUrl, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * DTO for updating user profile
 */
export class UpdateProfileDto {
    /**
     * User's full name
     * @example John Doe
     */
    @ApiProperty({
        example: 'John Doe',
        description: 'User full name',
    })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    /**
     * User's email address
     * @example john.doe@example.com
     * Note: Email is optional for profile updates, but if provided, it must be valid.
     */
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'User email address',
    })
    @Transform(({ value }) => value?.toLowerCase().trim())
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsOptional()
    email: string;

    /**
     * User's bio or description
     * @example Software developer with a passion for open source.
     */
    @ApiProperty({
        example: 'Software developer with a passion for open source.',
        description: 'User bio or description',
    })
    @IsString({ message: 'Bio must be a string' })
    bio: string;

    /**
     * URL to the user's avatar image
     * @example https://example.com/avatar.jpg
     * Note: Avatar URL is optional, but if provided, it should be a valid URL.
     */
    @ApiProperty({
        example: 'https://example.com/avatar.jpg',
        description: 'URL to the user avatar image',
    })
    @IsString({ message: 'Avatar URL must be a string' })
    @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
    avatarUrl: string;
}