import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { VerifyPasswordResetDto } from '../../dto/password-reset/verify-password-reset.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class VerifyPasswordResetService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly otpService: OtpService,
  ) {}

  async execute(dto: VerifyPasswordResetDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new NotFoundException('User not found');

    this.otpService.assertValidCode({
      expectedCode: user.passwordResetCode,
      expectedExpiresAt: user.passwordResetExpiresAt,
      providedCode: dto.code,
      purpose: 'PASSWORD_RESET',
    });

    // We don't reset password here—only verify
    return { message: 'Reset code verified successfully' };
  }
}