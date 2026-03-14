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

  // Academic Info
  classes?: Types.ObjectId[];
  studentId?: string;
  department?: string;
  semester?: number;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // Virtuals
  fullName?: string;
  initials?: string;
}

// ==================== User Document Interface (Mongoose) ====================
export interface IUserDocument extends IUser, Document {
  // Auth
  assertPasswordMatch(candidatePassword: string): Promise<void>;
  changedPasswordAfter(JWTTimestamp: number): boolean;

  // OTP helpers
  createEmailVerificationCode(expiresInMinutes?: number): string;
  verifyEmailCode(code: string): true;
  assertEmailVerificationCooldown(cooldownSeconds?: number): void;

  createPasswordResetCode(expiresInMinutes?: number): string;
  verifyResetCode(code: string): true;
  assertPasswordResetCooldown(cooldownSeconds?: number): void;

  // Password
  resetPassword(newPassword: string): Promise<void>;

  // Refresh token helpers
  addRefreshToken(token: string): Promise<void>;
  removeRefreshToken(token: string): Promise<void>;
}

// ==================== User Model Interface (Static Methods) ====================
export interface IUserModel {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByVerificationCode(code: string): Promise<IUserDocument | null>;
  findByResetCode(code: string): Promise<IUserDocument | null>;
}