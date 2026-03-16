import { Injectable } from '@nestjs/common';
import { UserDocument } from '../../../../database/entities/user.entity';

@Injectable()
export class UserSanitizerService {
  sanitize(user: UserDocument | null): Partial<UserDocument> | null {
    if (!user) return user;

    const obj = user.toObject ? user.toObject() : { ...user };

    // Always remove sensitive stuff
    delete obj.password;
    delete obj.refreshTokens;

    // Remove OTP/internal fields
    delete obj.emailVerificationCode;
    delete obj.emailVerificationExpiresAt;
    delete obj.emailVerificationLastSentAt;

    delete obj.passwordResetCode;
    delete obj.passwordResetExpiresAt;
    delete obj.passwordResetLastSentAt;

    return obj;
  }
}