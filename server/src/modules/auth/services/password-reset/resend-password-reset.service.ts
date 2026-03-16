import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { RequestPasswordResetDto } from '../../dto/password-reset/request-password-reset.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { MailService } from '../../../../modules/mail/services/mail.service';

@Injectable()
export class ResendPasswordResetService {
  private readonly otpExpiryMinutes = 15;
  private readonly cooldownSeconds = 60;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: RequestPasswordResetDto) {
    const email = dto.email.toLowerCase().trim();

    // passwordResetCode/passwordResetExpiresAt are select:false, but we don't need to read them here.
    const user: UserDocument | null = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    // no OtpService: entity cooldown helper
    // (uses lastPasswordResetRequestAt internally)
    user.assertPasswordResetCooldown(this.cooldownSeconds);

    // no OtpService: entity generates code + sets expiresAt internally
    const code = user.createPasswordResetCode(this.otpExpiryMinutes);

    user.lastPasswordResetRequestAt = new Date();
    await user.save();

    await this.mailService.sendPasswordResetEmail(
      user.email,
      (user as { fullName : string}).fullName || user.firstName,
      code,
    );

    return { message: 'Password reset code resent successfully' };
  }
}