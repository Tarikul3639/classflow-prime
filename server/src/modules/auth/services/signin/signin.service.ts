import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { SignInDto } from '../../dto/signin/signin.dto';
import { TokenService } from '../token/token.service';
import { UserSanitizerService } from '../sanitizer/user-sanitizer.service';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { ThrottlePurpose } from '../../../../database/entities/auth-throttle.entity';
import { AuthThrottleService } from '../throttle/auth-throttle.service';

type Ctx = { ip: string; userAgent?: string };

@Injectable()
export class SignInService {
  private readonly maxAttempts = 5;
  private readonly lockMinutes = 30;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokenService: TokenService,
    private readonly sanitizer: UserSanitizerService,
    private readonly throttle: AuthThrottleService,
  ) {}

  async execute(dto: SignInDto, ctx: Ctx) {
    const email = dto.email.toLowerCase().trim();
    const ip = (ctx.ip || '').trim() || 'unknown';

    // 1) throttle check (throws ForbiddenException with remaining time if locked)
    const t = await this.throttle.assertNotLocked({
      key: email,
      ip,
      purpose: ThrottlePurpose.SIGN_IN,
      userAgent: ctx.userAgent,
    });

    // 2) load user (+password)
    const user = await this.userModel
      .findOne({ email })
      .select('+password +refreshTokens');

    if (!user) {
      await this.throttle.fail(t, {
        maxAttempts: this.maxAttempts,
        lockMinutes: this.lockMinutes,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3) password check
    try {
      await user.assertPasswordMatch(dto.password);
      await this.throttle.success(t);
    } catch (err) {
      await this.throttle.fail(t, {
        maxAttempts: this.maxAttempts,
        lockMinutes: this.lockMinutes,
      });
      throw err;
    }

    // 4) issue tokens
    const tokens = await this.tokenService.signTokens({
      sub: user._id.toString(),
      email: user.email,
    });

    // 5) store refresh token
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(tokens.refreshToken);

    user.lastLogin = new Date();
    await user.save();

    return { user: this.sanitizer.sanitize(user), tokens };
  }
}