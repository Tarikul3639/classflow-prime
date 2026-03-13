import { Types, Document } from 'mongoose';
import { UserRole, UserStatus } from '../entities/user.entity';

// ==================== Base User Interface ====================
export interface IUser {
  // Basic Information
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;

  // Role & Status
  role: UserRole;
  status: UserStatus;
  isActive: boolean;

  // Email Verification
  isEmailVerified: boolean;
  emailVerificationCode?: string;
  emailVerificationExpiresAt?: Date;
  emailVerifiedAt?: Date;
  emailVerificationLastSentAt?: Date;

  // Password Reset
  passwordResetCode?: string;
  passwordResetExpiresAt?: Date;
  passwordChangedAt?: Date;
  lastPasswordResetRequestAt?: Date;
  passwordResetAttempts: number;

  // Security
  lastLogin?: Date;
  lastLoginIp?: string;
  refreshTokens?: string[];
  failedLoginAttempts: number;
  accountLockedUntil?: Date;

  // Academic Info
  classes?: Types.ObjectId[];
  studentId?: string;
  department?: string;
  semester?: number;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // Virtual Properties
  fullName?: string;
  initials?: string;
}

// ==================== User Document Interface (Mongoose) ====================
export interface IUserDocument extends IUser, Document {
  // Instance Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  isAccountLocked(): boolean;
  incrementFailedLoginAttempts(): Promise<void>;
  resetFailedLoginAttempts(): Promise<void>;
  createEmailVerificationCode(): string;
  createPasswordResetCode(): string;
  verifyEmailCode(code: string): boolean;
  verifyResetCode(code: string): boolean;
  resetPassword(newPassword: string): Promise<void>;
  addRefreshToken(token: string): Promise<void>;
  removeRefreshToken(token: string): Promise<void>;
}

// ==================== User Model Interface (Static Methods) ====================
export interface IUserModel {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByVerificationCode(code: string): Promise<IUserDocument | null>;
  findByResetCode(code: string): Promise<IUserDocument | null>;
}