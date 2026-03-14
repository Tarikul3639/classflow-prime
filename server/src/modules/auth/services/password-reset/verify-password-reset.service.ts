import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { VerifyPasswordResetDto } from '../../dto/password-reset/verify-password-reset.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';

@Injectable()
export class VerifyPasswordResetService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async execute(dto: VerifyPasswordResetDto) {
    const email = dto.email.toLowerCase().trim();

    // must select hidden reset fields (select:false)
    const user = await this.userModel
      .findOne({ email })

    if (!user) throw new NotFoundException('User not found');

    // no OtpService: entity method throws BadRequestException if invalid/expired
    user.verifyResetCode(dto.code);

    return { message: 'Reset code verified successfully' };
  }
}