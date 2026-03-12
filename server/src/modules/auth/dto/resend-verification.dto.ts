import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * DTO for resending verification code
 */
export class ResendVerificationDto {
  /**
   * Email address to resend verification code
   * @example john.doe@example.com
   */
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address to resend verification code',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;
}