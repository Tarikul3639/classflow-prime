import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignInDto } from '../../dto/signin/signin.dto';
import { TokenService } from '../token/token.service';
import { UserSanitizerService } from '../sanitizer/user-sanitizer.service';

// Replace with your actual User model/repo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../../database/entities/user.entity';

@Injectable()
export class SignInService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokenService: TokenService,
    private readonly sanitizer: UserSanitizerService,
  ) {}

  async execute(dto: SignInDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // optionally block login if not verified:
    // if (!user.isEmailVerified) throw new BadRequestException('Please verify your email first');

    const tokens = await this.tokenService.signTokens({
      sub: user._id.toString(),
      email: user.email,
    });

    // store refresh token (hashed recommended)
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return {
      user: this.sanitizer.sanitize(user),
      tokens,
    };
  }
}