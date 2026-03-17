export interface IVerification {
  _id?: string;
  userId?: string;        // optional, link to user
  identifier: string;     // email or phone
  value: string;          // OTP or token
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}