import { Injectable } from '@nestjs/common';
import { UserDocument } from '../../../database/entities/user.entity';

/**
 * UserSanitizerService
 * Removes sensitive fields from user objects before sending to client
 */
@Injectable()
export class UserSanitizerService {
  /**
   * Remove sensitive fields from user document
   */
  sanitize(user: UserDocument): Record<string, any> {
    const userObject = user.toObject();
    
    // Remove sensitive fields
    delete userObject.password;
    delete userObject.emailVerificationCode;
    delete userObject.emailVerificationExpires;
    delete userObject.passwordResetCode;
    delete userObject.passwordResetExpires;
    delete userObject.refreshTokens;
    delete userObject.__v;
    
    return userObject;
  }
}