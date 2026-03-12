import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserStatus } from '../../../database/entities/user.entity';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { IVerifyEmailResponse } from '../interfaces/auth.interface';
import { MailService } from '../../mail/services/mail.service';
import { UserSanitizerService } from './user-sanitizer.service';

/**
 * VerifyEmailService
 * Handles email verification with email + 6-digit code
 * - Validates email and verification code together
 * - Marks email as verified
 * - Activates user account
 * - Sends welcome email
 */
@Injectable()
export class VerifyEmailService {
  private readonly logger = new Logger(VerifyEmailService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
    private userSanitizer: UserSanitizerService,
  ) { }

  /**
   * Verify user's email with email + 6-digit code
   * @param verifyEmailDto - Contains email and 6-digit verification code
   * @returns Success message and sanitized user data
   * @throws BadRequestException if code is invalid, expired, or already verified
   */
  async execute(verifyEmailDto: VerifyEmailDto): Promise<IVerifyEmailResponse> {
    this.logger.log(
      `Email verification attempt for: ${verifyEmailDto.email} with code: ${verifyEmailDto.code}`,
    );

    const { email, code } = verifyEmailDto;

    // 1. Find user by email AND verification code (must not be expired)
    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
      emailVerificationCode: code,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      this.logger.warn(
        `Email verification failed: Invalid or expired code for ${email} - Code: ${code}`,
      );
      throw new BadRequestException(
        'Invalid or expired verification code. Please request a new one.',
      );
    }

    // 2. Check if email is already verified
    if (user.isEmailVerified) {
      this.logger.warn(
        `Email verification failed: Already verified - ${user.email}`,
      );
      throw new BadRequestException('Email is already verified');
    }

    // 3. Mark email as verified and activate account
    user.isEmailVerified = true;
    user.status = UserStatus.ACTIVE;
    user.emailVerifiedAt = new Date();
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    this.logger.log(
      `Email verified successfully: ${user.email} (ID: ${user._id})`,
    );

    // 4. Send welcome email (non-blocking, failure is OK)
    this.mailService
      .sendWelcomeEmail(user.email, user.firstName)
      .catch((error) => {
        this.logger.error(
          `Failed to send welcome email to ${user.email}: ${error.message}`,
        );
      });

    return {
      message: 'Email verified successfully',
      user: this.userSanitizer.sanitize(user),
    };
  }
}