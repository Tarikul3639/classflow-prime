import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../database/entities/user.entity';

/**
 * DTO for user registration/signup
 * Validates all required fields for creating a new user account
 */
export class SignUpDto {
  /**
   * User's email address
   * Must be a valid email format and will be stored in lowercase
   * @example john.doe@example.com
   */
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  /**
   * User's password
   * Must be at least 8 characters and contain:
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character (@$!%*?&#)
   * @example StrongP@ssw0rd
   */
  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description:
      'Password (min 8 chars, must include uppercase, lowercase, number, and special character)',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
  })
  password: string;

  /**
   * User's first name
   * @example John
   */
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  /**
   * User's last name (optional)
   * @example Doe
   */
  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  /**
   * User's username (optional)
   * If not provided, will be auto-generated from email
   * @example john_doe
   */
  @ApiPropertyOptional({
    example: 'john_doe',
    description:
      'Unique username (optional, auto-generated from email if not provided)',
    minLength: 3,
    maxLength: 30,
  })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username must not exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  username?: string;

  /**
   * User's role
   * Defaults to 'student' if not provided
   * @example student
   */
  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.STUDENT,
    description: 'User role (defaults to student)',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of: admin, teacher, student' })
  role?: UserRole;

  /**
   * User's phone number (optional)
   * @example +8801712345678
   */
  @ApiPropertyOptional({
    example: '+8801712345678',
    description: 'User phone number (optional)',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid phone number (E.164 format)',
  })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  /**
   * Student ID (optional, for students only)
   * @example CSE-2024-001
   */
  @ApiPropertyOptional({
    example: 'CSE-2024-001',
    description: 'Student ID (optional, for students)',
  })
  @IsOptional()
  @IsString({ message: 'Student ID must be a string' })
  @MaxLength(50, { message: 'Student ID must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim().toUpperCase())
  studentId?: string;

  /**
   * Department name (optional)
   * @example Computer Science
   */
  @ApiPropertyOptional({
    example: 'Computer Science',
    description: 'Department name (optional)',
  })
  @IsOptional()
  @IsString({ message: 'Department must be a string' })
  @MaxLength(100, { message: 'Department name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  department?: string;

  /**
   * Profile avatar URL (optional)
   * @example https://example.com/avatar.jpg
   */
  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Profile avatar URL (optional)',
  })
  @IsOptional()
  @IsString({ message: 'Avatar URL must be a string' })
  @Matches(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i, {
    message: 'Avatar must be a valid image URL (jpg, jpeg, png, gif, webp)',
  })
  avatarUrl?: string;
}