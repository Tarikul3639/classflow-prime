import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser, IUserDocument } from '../interface/user.interface';

export type UserDocument = User & IUserDocument;

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

interface IUserJSON {
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  avatar?: string;
  [key: string]: unknown; // Allow additional properties for virtuals and transformations
}

@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: {
    virtuals: true,
    transform: (_doc: Document, ret: IUserJSON) => {
      // Remove form Api response not from backend
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      return ret;
    },
  },
})

// =============================================================
// ==================== User Schema ============================
// =============================================================
export class User implements IUser {
  // ==================== Basic Information ====================

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: false, trim: true })
  lastName?: string;

  @Prop({ unique: true, sparse: true, trim: true })
  username?: string;

  @Prop({ default: null })
  avatarUrl?: string;

  @Prop()
  bio?: string;

  @Prop({ trim: true })
  phone?: string;

  // ==================== Role & Status ====================

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.STUDENT,
    index: true,
  })
  role: UserRole;

  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
    index: true,
  })
  status: UserStatus;

  @Prop({ default: true })
  isActive: boolean;

  // ==================== Email Verification ====================

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ select: false })
  emailVerificationCode?: string; // 6-digit code instead of token

  @Prop({ select: false })
  emailVerificationExpires?: Date;

  @Prop()
  emailVerifiedAt?: Date;

  // ==================== Password Reset ====================

  @Prop({ select: false })
  passwordResetCode?: string; // 6-digit code instead of token

  @Prop({ select: false })
  passwordResetExpires?: Date;

  @Prop()
  passwordChangedAt?: Date;

  @Prop()
  lastPasswordResetRequestAt?: Date;

  @Prop({ default: 0 })
  passwordResetAttempts: number;

  // ==================== Security ====================

  @Prop({ type: Date })
  lastLogin?: Date;

  @Prop()
  lastLoginIp?: string;

  @Prop({ type: [String], default: [] })
  refreshTokens?: string[];

  @Prop({ default: 0 })
  failedLoginAttempts: number;

  @Prop()
  accountLockedUntil?: Date;

  // ==================== Academic Info ====================

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Class' }], default: [] })
  classes?: Types.ObjectId[];

  @Prop()
  studentId?: string;

  @Prop()
  department?: string;

  @Prop()
  semester?: number;

  // ==================== Timestamps ====================

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

// ==================== Create Schema ====================
export const UserSchema = SchemaFactory.createForClass(User);

// ==================== Indexes ====================
UserSchema.index({ isEmailVerified: 1 });
UserSchema.index({ emailVerificationCode: 1 });
UserSchema.index({ passwordResetToken: 1 });
UserSchema.index({ createdAt: -1 });

// Text search
UserSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  username: 'text',
});

// ==================== Virtual Properties ====================
UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('initials').get(function (this: UserDocument) {
  return `${this.firstName.charAt(0)}${this.lastName?.charAt(0)}`.toUpperCase();
});

// ==================== Pre-save Middleware ====================
UserSchema.pre<UserDocument>('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = new Date();
  }

  // Generate username from email if not provided
  if (!this.username && this.email) {
    const baseUsername = this.email.split('@')[0];
    this.username = baseUsername;
  }

  // Update status when email is verified
  if (this.isModified('isEmailVerified') && this.isEmailVerified) {
    this.status = UserStatus.ACTIVE;
    this.emailVerifiedAt = new Date();
    this.emailVerificationCode = undefined;
    this.emailVerificationExpires = undefined;
  }
});

// ==================== Instance Methods ====================

// Compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Check if password was changed after JWT was issued
UserSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number,
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Check if account is locked
UserSchema.methods.isAccountLocked = function (): boolean {
  return this.accountLockedUntil && this.accountLockedUntil > new Date();
};

// Increment failed login attempts
UserSchema.methods.incrementFailedLoginAttempts =
  async function (): Promise<void> {
    this.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts for 30 minutes
    if (this.failedLoginAttempts >= 5) {
      this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.save();
  };

// Reset failed login attempts
UserSchema.methods.resetFailedLoginAttempts = async function (): Promise<void> {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = undefined;
  await this.save();
};

// Create email verification code (6 digits)
UserSchema.methods.createEmailVerificationCode = function (): string {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  this.emailVerificationCode = verificationCode;

  // Code expires in 15 minutes
  this.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);

  return verificationCode;
};

// Create password reset code (6 digits)
UserSchema.methods.createPasswordResetCode = function (): string {
  // Generate 6-digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  this.passwordResetCode = resetCode;

  // Code expires in 15 minutes
  this.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  this.lastPasswordResetRequestAt = new Date();
  this.passwordResetAttempts += 1;

  return resetCode;
};

// Verify email verification code
UserSchema.methods.verifyEmailCode = function (code: string): boolean {
  return (
    this.emailVerificationCode === code &&
    this.emailVerificationExpires > new Date()
  );
};

// Verify password reset code
UserSchema.methods.verifyResetCode = function (code: string): boolean {
  return (
    this.passwordResetCode === code && this.passwordResetExpires > new Date()
  );
};

// Reset password
UserSchema.methods.resetPassword = async function (
  newPassword: string,
): Promise<void> {
  this.password = newPassword; // Will be hashed by pre-save middleware
  this.passwordResetCode = undefined;
  this.passwordResetExpires = undefined;
  this.passwordResetAttempts = 0;
  this.passwordChangedAt = new Date();
  await this.save();
};

// Add refresh token
UserSchema.methods.addRefreshToken = async function (
  token: string,
): Promise<void> {
  if (this.refreshTokens.length >= 5) {
    this.refreshTokens.shift();
  }
  this.refreshTokens.push(token);
  await this.save();
};

// Remove refresh token
UserSchema.methods.removeRefreshToken = async function (
  token: string,
): Promise<void> {
  this.refreshTokens = this.refreshTokens.filter((t) => t !== token);
  await this.save();
};

// ==================== Static Methods ====================

UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findByVerificationCode = function (code: string) {
  return this.findOne({
    emailVerificationCode: code,
    emailVerificationExpires: { $gt: new Date() },
  });
};

UserSchema.statics.findByResetCode = function (code: string) {
  return this.findOne({
    passwordResetCode: code,
    passwordResetExpires: { $gt: new Date() },
  });
};
