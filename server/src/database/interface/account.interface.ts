import { Types } from 'mongoose';

export enum AccountProvider {
  GOOGLE = 'google',
  GITHUB = 'github',
  FACEBOOK = 'facebook',
  PASSWORD = 'password',
}

export interface IAccount {
  _id?: string;
  userId: Types.ObjectId;         // User _id
  accountId: string;      // Provider-specific user ID
  providerId: AccountProvider;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  idToken?: string;
  password?: string;      // hashed password
  createdAt?: Date;
  updatedAt?: Date;
}