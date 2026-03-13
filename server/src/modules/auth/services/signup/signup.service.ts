import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SignUpDto } from '../../dto/signup/signup.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../../../../modules/mail/services/mail.service';
import { UserSanitizerService } from '../sanitizer/user-sanitizer.service';

@Injectable()
export class SignUpService {
  private readonly otpExpiryMinutes = 15;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly sanitizer: UserSanitizerService,
  ) {}

  async execute(dto: SignUpDto) {
    const email = dto.email.toLowerCase();

    const exists = await this.userModel.findOne({ email });
    if (exists) throw new ConflictException('User with this email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const { code, expiresAt } = this.otpService.createCode(this.otpExpiryMinutes);

    const user = await this.userModel.create({
      firstName: dto.name,
      email,
      password: passwordHash,
      avatarUrl: dto.avatarUrl,
      isEmailVerified: false,
      emailVerificationCode: code,
      emailVerificationExpiresAt: expiresAt,
      emailVerificationLastSentAt: new Date(),
    });

    await this.mailService.sendVerificationEmail(user.email, user.firstName, code);

    return {
      message: 'Signup successful. Verification code sent to email.',
      user: this.sanitizer.sanitize(user),
    };
  }
}