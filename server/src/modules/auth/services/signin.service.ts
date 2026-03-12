import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserStatus } from '../../../database/entities/user.entity';
import { SignInDto } from '../dto/signin.dto';
import { ISignInResponse } from '../interfaces/auth.interface';
import { TokenService } from './token.service';
import { UserSanitizerService } from './user-sanitizer.service';

/**
 * SignInService
 * Handles user login logic
 */
@Injectable()
export class SignInService {
  private readonly logger = new Logger(SignInService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenService: TokenService,
    private userSanitizer: UserSanitizerService,
  ) {}

  async execute(signInDto: SignInDto): Promise<ISignInResponse> {
    this.logger.log(`SignIn attempt for email: ${signInDto.email}`);

    const { email, password } = signInDto;

    // Find user with password
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();

    if (!user) {
      this.logger.warn(`SignIn failed: User not found - ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      const lockedUntil = user.accountLockedUntil ?? new Date(Date.now());
      const remainingMinutes = Math.ceil(
        (lockedUntil.getTime() - Date.now()) / 60000,
      );
      this.logger.warn(
        `SignIn failed: Account locked - ${email} (${remainingMinutes} minutes remaining)`,
      );
      throw new UnauthorizedException(
        `Account is temporarily locked. Please try again in ${remainingMinutes} minutes.`,
      );
    }

    // Check if account is suspended
    if (user.status === UserStatus.SUSPENDED) {
      this.logger.warn(`SignIn failed: Account suspended - ${email}`);
      throw new UnauthorizedException(
        'Your account has been suspended. Please contact support.',
      );
    }

    // Check if account is inactive
    if (!user.isActive) {
      this.logger.warn(`SignIn failed: Account inactive - ${email}`);
      throw new UnauthorizedException('Your account is inactive.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      this.logger.warn(`SignIn failed: Invalid password - ${email}`);
      await user.incrementFailedLoginAttempts();
      throw new UnauthorizedException('Invalid email or password');
    }

    // Reset failed login attempts
    await user.resetFailedLoginAttempts();

    // Warn if email not verified
    if (!user.isEmailVerified) {
      this.logger.warn(`User ${user.email} logged in without email verification`);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    this.logger.log(`User logged in successfully: ${user.email} (ID: ${user._id})`);

    // Generate tokens
    const tokens = await this.tokenService.generateTokens(user);

    // Store refresh token
    await user.addRefreshToken(tokens.refreshToken);

    return {
      message: 'Login successful',
      user: this.userSanitizer.sanitize(user),
      tokens,
      emailVerified: user.isEmailVerified,
    };
  }
}