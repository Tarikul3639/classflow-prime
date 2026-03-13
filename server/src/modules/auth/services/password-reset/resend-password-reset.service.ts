import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RequestPasswordResetDto } from '../../dto/password-reset/request-password-reset.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../../../../modules/mail/services/mail.service';

@Injectable()
export class ResendPasswordResetService {
  private readonly otpExpiryMinutes = 15;
  private readonly cooldownSeconds = 60;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: RequestPasswordResetDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new NotFoundException('User not found');

    this.otpService.enforceCooldown(user.lastPasswordResetRequestAt, this.cooldownSeconds);

    const { code, expiresAt } = this.otpService.createCode(this.otpExpiryMinutes);

    user.passwordResetCode = code;
    user.passwordResetExpiresAt = expiresAt;
    user.lastPasswordResetRequestAt = new Date();
    await user.save();

    await this.mailService.sendPasswordResetEmail(user.email, user.fullName || user.firstName, code);

    return { message: 'Password reset code resent successfully' };
  }
}