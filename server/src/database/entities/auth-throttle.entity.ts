import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ForbiddenException } from '@nestjs/common';
import { IAuthThrottleMethods } from '../interface/auth-throttle.interface';

export type AuthThrottleDocument = AuthThrottle & Document & IAuthThrottleMethods;

export enum ThrottlePurpose {
  SIGN_IN = 'SIGN_IN',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_VERIFY = 'PASSWORD_RESET_VERIFY',
  EMAIL_VERIFY = 'EMAIL_VERIFY',
  RESEND_EMAIL_VERIFY = 'RESEND_EMAIL_VERIFY',
}

@Schema({ timestamps: true, collection: 'auth_throttles' })
export class AuthThrottle {
  @Prop({ required: true, lowercase: true, trim: true, index: true })
  key: string;

  @Prop({ required: true, trim: true, index: true })
  ip: string;

  @Prop({ type: String, enum: ThrottlePurpose, required: true, index: true })
  purpose: ThrottlePurpose;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ type: Date, default: null })
  lockedUntil?: Date | null;

  @Prop({ type: Date, default: null })
  lastAttemptAt?: Date | null;

  @Prop({ default: '' })
  lastUserAgent?: string;
}

export const AuthThrottleSchema = SchemaFactory.createForClass(AuthThrottle);

// unique per key+ip+purpose
AuthThrottleSchema.index({ key: 1, ip: 1, purpose: 1 }, { unique: true });
AuthThrottleSchema.index({ lockedUntil: 1 });

// attach instance methods
AuthThrottleSchema.methods.assertNotLocked = function (): void {
  if (!this.lockedUntil) return;
  if (this.lockedUntil <= new Date()) return;

  const remainingSeconds = Math.max(
    1,
    Math.ceil((this.lockedUntil.getTime() - Date.now()) / 1000),
  );
  const remainingMinutes = Math.ceil(remainingSeconds / 60);

  throw new ForbiddenException(
    `Too many attempts. Try again in ${remainingMinutes} minute(s).`,
  );
};

AuthThrottleSchema.methods.recordFailure = function (
  maxAttempts: number,
  lockMinutes: number,
): void {
  this.attempts += 1;
  this.lastAttemptAt = new Date();

  if (this.attempts >= maxAttempts) {
    this.lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
  }
};

AuthThrottleSchema.methods.recordSuccess = function (): void {
  this.attempts = 0;
  this.lockedUntil = null;
};