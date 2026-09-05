import { Types } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface IUser {
  _id?: Types.ObjectId | string; // MongoDB ObjectId as string
  name: string;
  role: UserRole;
  email: string;
  emailVerified: boolean;
  avatarUrl?: string | null;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
