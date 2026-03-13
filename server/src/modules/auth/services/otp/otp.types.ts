export type OtpPurpose = 'SIGNUP_EMAIL_VERIFICATION' | 'PASSWORD_RESET';

export interface CreateOtpResult {
  code: string;           // 6-digit
  expiresAt: Date;
}