import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../database/entities/user.entity';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { IResendVerificationResponse } from '../interfaces/auth.interface';
import { MailService } from '../../mail/services/mail.service';

/**
 * ResendVerificationService
 * Handles resending email verification codes
 * - Rate limiting (2 minutes between requests)
 * - Generates new verification code
 * - Sends verification email
 */
@Injectable()
export class ResendVerificationService {
  private readonly logger = new Logger(ResendVerificationService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  /**
   * Resend verification code to user's email
   * @param resendDto - Contains user email
   * @returns Success message
   * @throws NotFoundException if user not found
   * @throws BadRequestException if already verified or rate limited
   */
  async execute(resendDto: ResendVerificationDto): Promise<IResendVerificationResponse> {
    this.logger.log(`Resend verification request for: ${resendDto.email}`);

    const { email } = resendDto;

    // 1. Find user by email
    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      this.logger.warn(`Resend verification failed: User not found - ${email}`);
      throw new NotFoundException('User not found');
    }

    // 2. Check if email is already verified
    if (user.isEmailVerified) {
      this.logger.warn(`Resend verification failed: Already verified - ${email}`);
      throw new BadRequestException('Email is already verified');
    }

    // 3. Rate limiting check (2 minutes between requests)
    if (user.emailVerificationExpires) {
      const lastSent = new Date(
        user.emailVerificationExpires.getTime() - 15 * 60 * 1000, // Subtract 15 min expiry to get actual send time
      );
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

      if (lastSent > twoMinutesAgo) {
        const remainingSeconds = Math.ceil(
          (lastSent.getTime() - twoMinutesAgo.getTime()) / 1000,
        );
        this.logger.warn(
          `Resend verification rate limited - ${email} (${remainingSeconds}s remaining)`,
        );
        throw new BadRequestException(
          `Please wait ${remainingSeconds} seconds before requesting another code`,
        );
      }
    }

    // 4. Generate new verification code
    const verificationCode = user.createEmailVerificationCode();
    await user.save();

    this.logger.log(
      `New verification code generated for: ${user.email} (Code: ${verificationCode})`,
    );

    // 5. Send verification email
    try {
      await this.mailService.sendVerificationEmail(
        user.email,
        user.firstName,
        verificationCode,
      );
      this.logger.log(`Verification email resent successfully to ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to resend verification email to ${user.email}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Failed to send verification email. Please try again later.',
      );
    }

    return {
      message: 'Verification code sent successfully',
    };
  }
}