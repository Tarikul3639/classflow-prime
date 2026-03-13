import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ResendSignupVerificationDto } from '../../dto/signup/resend-signup-verification.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../../../../modules/mail/services/mail.service';

@Injectable()
export class ResendSignupVerificationService {
  private readonly otpExpiryMinutes = 15;
  private readonly cooldownSeconds = 60;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: ResendSignupVerificationDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new NotFoundException('User not found');

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    this.otpService.enforceCooldown(user.emailVerificationLastSentAt, this.cooldownSeconds);

    const { code, expiresAt } = this.otpService.createCode(this.otpExpiryMinutes);

    user.emailVerificationCode = code;
    user.emailVerificationExpiresAt = expiresAt;
    user.emailVerificationLastSentAt = new Date();
    await user.save();

    await this.mailService.sendVerificationEmail(user.email, user.fullName || user.firstName, code);

    return { message: 'Verification code resent successfully' };
  }
}