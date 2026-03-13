import { BadRequestException, Injectable } from '@nestjs/common';
import type { CreateOtpResult, OtpPurpose } from './otp.types';

@Injectable()
export class OtpService {
  /**
   * 6-digit numeric OTP
   */
  createCode(expiresInMinutes: number): CreateOtpResult {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    return { code, expiresAt };
  }

  /**
   * Rate limiting helper (simple)
   * If lastSentAt is within cooldownSeconds => throw
   */
  enforceCooldown(lastSentAt: Date | undefined | null, cooldownSeconds: number) {
    if (!lastSentAt) return;

    const nextAllowedAt = new Date(lastSentAt.getTime() + cooldownSeconds * 1000);
    if (nextAllowedAt > new Date()) {
      const remaining = Math.ceil((nextAllowedAt.getTime() - Date.now()) / 1000);
      throw new BadRequestException(
        `Please wait ${remaining}s before requesting a new code.`,
      );
    }
  }

  /**
   * Verify code & expiry (generic)
   */
  assertValidCode(params: {
    expectedCode?: string | null;
    expectedExpiresAt?: Date | null;
    providedCode: string;
    purpose: OtpPurpose;
  }) {
    const { expectedCode, expectedExpiresAt, providedCode } = params;

    if (!expectedCode || !expectedExpiresAt) {
      throw new BadRequestException('No verification code found. Please request a new one.');
    }

    if (expectedExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Code expired. Please request a new one.');
    }

    if (expectedCode !== providedCode) {
      throw new BadRequestException('Invalid code.');
    }
  }
}