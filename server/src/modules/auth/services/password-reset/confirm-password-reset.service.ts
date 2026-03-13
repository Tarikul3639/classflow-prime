import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ResetPasswordDto } from '../../dto/password-reset/reset-password.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../../../../modules/mail/services/mail.service';

@Injectable()
export class ConfirmPasswordResetService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new NotFoundException('User not found');

    this.otpService.assertValidCode({
      expectedCode: user.passwordResetCode,
      expectedExpiresAt: user.passwordResetExpiresAt,
      providedCode: dto.code,
      purpose: 'PASSWORD_RESET',
    });

    user.password = await bcrypt.hash(dto.newPassword, 10);

    // clear reset fields
    user.passwordResetCode = undefined;
    user.passwordResetExpiresAt = undefined;

    // invalidate sessions
    user.refreshTokens = [];

    await user.save();

    // optional: send security email
    await this.mailService.sendPasswordChangedEmail(user.email, user.fullName || user.firstName);

    return { message: 'Password reset successfully' };
  }
}