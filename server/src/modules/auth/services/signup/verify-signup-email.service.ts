import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { VerifySignupEmailDto } from '../../dto/signup/verify-signup-email.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../../../../modules/mail/services/mail.service';
import { UserSanitizerService } from '../sanitizer/user-sanitizer.service';

@Injectable()
export class VerifySignupEmailService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly sanitizer: UserSanitizerService,
  ) {}

  async execute(dto: VerifySignupEmailDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new NotFoundException('User not found');

    if (user.isEmailVerified) {
      return { message: 'Email already verified', user: this.sanitizer.sanitize(user) };
    }

    this.otpService.assertValidCode({
      expectedCode: user.emailVerificationCode,
      expectedExpiresAt: user.emailVerificationExpiresAt,
      providedCode: dto.code,
      purpose: 'SIGNUP_EMAIL_VERIFICATION',
    });

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();

    // optional: send welcome email
    await this.mailService.sendWelcomeEmail(user.email, user.fullName || user.firstName);

    return { message: 'Email verified successfully', user: this.sanitizer.sanitize(user) };
  }
}