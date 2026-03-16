import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { ResendSignupVerificationDto } from '../../dto/signup/resend-signup-verification.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { MailService } from '../../../../modules/mail/services/mail.service';
import { EmailValidator } from 'src/shared/utils/email-validator.util';

@Injectable()
export class ResendSignupVerificationService {
  private readonly resendCooldownSeconds = 60;
  private readonly otpExpiryMinutes = 15;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) { }

  async execute(dto: ResendSignupVerificationDto) {
    const email = dto.email.toLowerCase().trim();

    // 1) basic format check (so user gets clean message)
    if (!EmailValidator.isValidFormat(dto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // 2) disposable / temporary email block (this throws your message)
    EmailValidator.validateOrThrow(dto.email);

    const user: UserDocument | null = await this.userModel
      .findOne({ email })
      .select('+emailVerificationCode +emailVerificationExpiresAt');

    if (!user) throw new NotFoundException('User not found');

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Check cooldown using entity method (throws if still in cooldown)
    user.assertEmailVerificationCooldown(this.resendCooldownSeconds);

    // Create new code and update timestamp using entity method
    const code = user.createEmailVerificationCode(this.otpExpiryMinutes);
    user.emailVerificationLastSentAt = new Date();

    await user.save();

    try {
      await this.mailService.sendVerificationEmail(
        user.email,
        (user as { fullName: string }).fullName || user.firstName,
        code,
      );
    } catch (_err) {
      throw new InternalServerErrorException(
        'Failed to send verification email. Please try again later.',
      );
    }

    return { message: 'Verification code resent successfully' };
  }
}