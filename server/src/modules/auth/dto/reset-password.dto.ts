import { IsString, IsNotEmpty, MinLength, Matches, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * DTO for password reset with 6-digit code
 */
export class ResetPasswordDto {
  /**
   * User email address
   * @example john.doe@example.com
   * Must be a valid email format
   * Will be transformed to lowercase and trimmed
   * */
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  /**
   * 6-digit password reset code sent to email
   * @example 123456
   */
  @ApiProperty({
    example: '123456',
    description: '6-digit password reset code',
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'Reset code must be a string' })
  @IsNotEmpty({ message: 'Reset code is required' })
  @Length(6, 6, { message: 'Reset code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Reset code must be 6 digits' })
  code: string;

  /**
   * New password
   * Must be at least 8 characters and contain:
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   * @example NewStrongP@ssw0rd
   */
  @ApiProperty({
    example: 'NewStrongP@ssw0rd',
    description: 'New password',
    minLength: 8,
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  newPassword: string;
}