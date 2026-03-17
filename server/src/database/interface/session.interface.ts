import { Types } from 'mongoose';

export interface ISession {
  _id?: string;
  userId: Types.ObjectId;
  token: string;          // hashed token
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}