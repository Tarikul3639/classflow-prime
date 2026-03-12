import { IsString, IsNotEmpty, Length, Matches, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * DTO for email verification with 6-digit code
 */
export class VerifyEmailDto {
  /**
   * User's email address
   * Must be a valid email format and will be stored in lowercase
   * @example 'john.doe@example.com'
   * */
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  /**
 * 6-digit verification code sent to email
 * @example 123456
 */
  @ApiProperty({
    example: '123456',
    description: '6-digit verification code',
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'Verification code must be a string' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Verification code must be 6 digits' })
  code: string;
}