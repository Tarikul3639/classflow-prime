import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { SignInDto } from '../../dto/signin/signin.dto';
import { TokenService } from '../token/token.service';
import { User, UserDocument } from 'src/database/entities/user.entity';
import { Account, AccountDocument } from 'src/database/entities/account.entity';
import { AccountProvider } from 'src/database/interface/account.interface';
import { ThrottlePurpose } from 'src/database/interface/throttle.interface';
import { AuthThrottleService } from '../throttle/auth-throttle.service';
import { ITokens } from '../token/token.types';

export class SignInResponseDto {
  message: string;
  user: any;
  tokens: ITokens;
}

type Ctx = { ip: string; userAgent?: string };

@Injectable()
export class SignInService {
  private readonly maxAttempts = 5;
  private readonly lockMinutes = 30;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>,
    private readonly tokenService: TokenService,
    private readonly throttle: AuthThrottleService,
  ) {}

  async execute(dto: SignInDto, ctx: Ctx): Promise<SignInResponseDto> {
    const email = dto.email.toLowerCase().trim();
    const ip = (ctx.ip || 'unknown').trim();
    const ua = ctx.userAgent || 'unknown-device';

    // 1️⃣ Throttle check to prevent Brute-Force
    const t = await this.throttle.assertNotLocked({
      key: email,
      ip,
      purpose: ThrottlePurpose.SIGN_IN,
      userAgent: ua,
    });

    // 2️⃣ Load User by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      await this.handleFailure(t);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3️⃣ Load Account for password verification
    // In standard, passwords live in the Account entity linked to 'password' provider
    const account = await this.accountModel.findOne({
      userId: user._id,
      providerId: AccountProvider.PASSWORD,
    }).select('+password');

    if (!account) {
      await this.handleFailure(t);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4️⃣ Password Verification
    const isPasswordMatch = await account.comparePassword(dto.password);
    if (!isPasswordMatch) {
      await this.handleFailure(t);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 5️⃣ Success: Reset Throttling & Issue Tokens + Create Session
    await this.throttle.success(t);

    // This method now generates JWTs AND saves a hashed session in the Session collection
    const tokens = await this.tokenService.createSession(
      user._id.toString(),
      user.email,
      user.role,
      ip,
      ua,
    );

    return {
      message: 'Signed in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      tokens,
    };
  }

  /**
   * Internal helper to handle login failure logic
   */
  private async handleFailure(throttleDoc: any) {
    await this.throttle.fail(throttleDoc, {
      maxAttempts: this.maxAttempts,
      lockMinutes: this.lockMinutes,
    });
  }
}