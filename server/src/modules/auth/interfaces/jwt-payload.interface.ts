import type { Types } from 'mongoose';
import type { UserRole } from '../../../database/interface/user.interface';

/**
 * JWT payload structure
 * This is the data encoded in the JWT token
 */
export interface IJwtPayload {
  /**
   * User ID (subject)
   */
  sub: string | Types.ObjectId;

  /**
   * User email
   */
  email: string;

  /**
   * User role
   */
  role: UserRole;

  /**
   * Issued at timestamp (automatically added by JWT)
   */
  iat?: number;

  /**
   * Expiration timestamp (automatically added by JWT)
   */
  exp?: number;
}