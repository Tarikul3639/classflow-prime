import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument, UserStatus } from '../../../database/entities/user.entity';
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { MailService } from '../../mail/services/mail.service';
import {
  IAuthTokens,
  ISignUpResponse,
  ISignInResponse,
  IVerifyEmailResponse,
  IResendVerificationResponse,
  ILogoutResponse,
  ICurrentUserResponse,
} from '../interfaces/auth.interface';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * AuthService
 * Handles all authentication-related operations:
 * - User registration (signup)
 * - User login (signin)
 * - Email verification
 * - User logout
 * - Token generation and validation
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) { }

  // ==================== SIGNUP (User Registration) ====================

  /**
   * Register a new user account
   * Steps:
   * 1. Check if email already exists
   * 2. Create new user with hashed password (handled by pre-save middleware)
   * 3. Generate email verification code
   * 4. Send verification email
   * 5. Generate JWT access & refresh tokens
   * 6. Return user data and tokens
   *
   * @param SignUpDto - User registration data
   * @returns User object and authentication tokens
   * @throws ConflictException if email already exists
   */
  async signUp(SignUpDto: SignUpDto): Promise<ISignUpResponse> {
    this.logger.log(`Signup attempt for email: ${SignUpDto.email}`);

    const {
      email,
      password,
      firstName,
      lastName,
      username,
      role,
      phone,
      studentId,
      department,
      avatarUrl,
    } = SignUpDto;

    // 1. Check if email already exists
    const existingUser = await this.userModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      this.logger.warn(`Signup failed: Email already exists - ${email}`);
      throw new ConflictException('User with this email already exists');
    }

    // 2. Check if username is already taken (if provided)
    if (username) {
      const existingUsername = await this.userModel.findOne({ username });
      if (existingUsername) {
        throw new ConflictException('Username is already taken');
      }
    }

    // 3. Start MongoDB transaction
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      // 4. Create new user (password hashing is handled by pre-save middleware)
      const user = new this.userModel({
        email: email.toLowerCase(),
        password,
        firstName,
        lastName,
        username,
        role: role || undefined, // Will default to STUDENT
        phone,
        studentId,
        department,
        avatarUrl,
        status: UserStatus.PENDING_VERIFICATION,
        isEmailVerified: false,
      });

      // 5. Generate 6-digit verification code
      const verificationCode = user.createEmailVerificationCode();

      // 6. Save user to database within transaction
      await user.save({ session });

      this.logger.log(
        `User created successfully: ${user.email} (ID: ${user._id}, Code: ${verificationCode})`,
      );

      // 7. ⚠️ CRITICAL: Send verification email BEFORE committing transaction
      // If email fails, transaction will be rolled back
      try {
        await this.mailService.sendVerificationEmail(
          user.email,
          user.firstName,
          verificationCode,
        );
        this.logger.log(`Verification email sent successfully to ${user.email}`);
      } catch (emailError) {
        this.logger.error(
          `Failed to send verification email to ${user.email}: ${emailError.message}`,
        );
        // Throw error to trigger transaction rollback
        throw new InternalServerErrorException(
          'Failed to send verification email. Please try again later.',
        );
      }

      // 8. Commit transaction
      await session.commitTransaction();
      session.endSession();

      // 9. Generate authentication tokens
      const tokens = await this.generateTokens(user);

      // 10. Store refresh token
      await user.addRefreshToken(tokens.refreshToken);

      // 11. Return response
      return {
        message:
          'Registration successful. Please check your email for a 6-digit verification code.',
        user: this.sanitizeUser(user),
        tokens,
      };
    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();

      this.logger.error(`Signup failed: ${error.message}`);

      // Re-throw known exceptions
      if (error instanceof ConflictException) {
        throw error;
      }

      // Throw generic error for unknown issues
      throw new BadRequestException('Failed to create user account');
    }
  }

  // ==================== SIGNIN (User Login) ====================

  /**
   * Authenticate user and generate tokens
   */
  async signin(SignInDto: SignInDto): Promise<ISignInResponse> {
    this.logger.log(`Signin attempt for email: ${SignInDto.email}`);

    const { email, password } = SignInDto;

    // Find user with password field (select: false by default)
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();

    if (!user) {
      this.logger.warn(`Signin failed: User not found - ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      const lockedUntil = user.accountLockedUntil ?? new Date(Date.now());
      const remainingMinutes = Math.ceil(
        (lockedUntil.getTime() - Date.now()) / 60000,
      );
      this.logger.warn(
        `Signin failed: Account locked - ${email} (${remainingMinutes} minutes remaining)`,
      );
      throw new UnauthorizedException(
        `Account is temporarily locked. Please try again in ${remainingMinutes} minutes.`,
      );
    }

    // Check if account is suspended
    if (user.status === UserStatus.SUSPENDED) {
      this.logger.warn(`Signin failed: Account suspended - ${email}`);
      throw new UnauthorizedException(
        'Your account has been suspended. Please contact support.',
      );
    }

    // Check if account is inactive
    if (!user.isActive) {
      this.logger.warn(`Signin failed: Account inactive - ${email}`);
      throw new UnauthorizedException('Your account is inactive.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      this.logger.warn(`Signin failed: Invalid password - ${email}`);
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
    const tokens = await this.generateTokens(user);

    // Store refresh token
    await user.addRefreshToken(tokens.refreshToken);

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      tokens,
      emailVerified: user.isEmailVerified,
    };
  }

  // ==================== VERIFY EMAIL ====================

  /**
   * Verify user's email with 6-digit code
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<IVerifyEmailResponse> {
    this.logger.log(`Email verification attempt with code: ${verifyEmailDto.code}`);

    const { code } = verifyEmailDto;

    // Find user by verification code (static method)
    const user = await this.userModel.findOne({
      emailVerificationCode: code,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      this.logger.warn(`Email verification failed: Invalid or expired code - ${code}`);
      throw new BadRequestException(
        'Invalid or expired verification code. Please request a new one.',
      );
    }

    // Check if already verified
    if (user.isEmailVerified) {
      this.logger.warn(`Email verification failed: Already verified - ${user.email}`);
      throw new BadRequestException('Email is already verified');
    }

    // Verify email
    user.isEmailVerified = true;
    user.status = UserStatus.ACTIVE;
    user.emailVerifiedAt = new Date();
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    this.logger.log(`Email verified successfully: ${user.email} (ID: ${user._id})`);

    // Send welcome email (non-blocking)
    this.mailService
      .sendWelcomeEmail(user.email, user.firstName)
      .catch((error) => {
        this.logger.error(
          `Failed to send welcome email to ${user.email}: ${error.message}`,
        );
      });

    return {
      message: 'Email verified successfully',
      user: this.sanitizeUser(user),
    };
  }

  // ==================== RESEND VERIFICATION ====================

  /**
   * Resend verification code
   */
  async resendVerificationEmail(
    resendDto: ResendVerificationDto,
  ): Promise<IResendVerificationResponse> {
    this.logger.log(`Resend verification request for: ${resendDto.email}`);

    const { email } = resendDto;

    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      this.logger.warn(`Resend verification failed: User not found - ${email}`);
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      this.logger.warn(`Resend verification failed: Already verified - ${email}`);
      throw new BadRequestException('Email is already verified');
    }

    // Rate limiting (2 minutes)
    if (user.emailVerificationExpires) {
      const lastSent = new Date(
        user.emailVerificationExpires.getTime() - 15 * 60 * 1000,
      );
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

      if (lastSent > twoMinutesAgo) {
        const remainingSeconds = Math.ceil(
          (lastSent.getTime() - twoMinutesAgo.getTime()) / 1000,
        );
        throw new BadRequestException(
          `Please wait ${remainingSeconds} seconds before requesting another code`,
        );
      }
    }

    // Generate new code
    const verificationCode = user.createEmailVerificationCode();
    await user.save();

    this.logger.log(`New verification code generated for: ${user.email}`);

    // Send email
    await this.mailService.sendVerificationEmail(
      user.email,
      user.firstName,
      verificationCode,
    );

    return {
      message: 'Verification code sent successfully',
    };
  }

  // ==================== LOGOUT ====================

  /**
   * Logout user
   */
  async logout(userId: string, refreshToken?: string): Promise<ILogoutResponse> {
    this.logger.log(`Logout request for user: ${userId}`);

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (refreshToken) {
      await user.removeRefreshToken(refreshToken);
    } else {
      user.refreshTokens = [];
      await user.save();
    }

    return {
      message: 'Logout successful',
    };
  }

  // ==================== GET CURRENT USER ====================

  /**
   * Get current user
   */
  async getCurrentUser(userId: string): Promise<ICurrentUserResponse> {
    const user = await this.userModel.findById(userId).select('-password').exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: this.sanitizeUser(user),
    };
  }

  // ==================== VALIDATE USER (for LocalStrategy) ====================

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      await user.incrementFailedLoginAttempts();
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // ==================== HELPER METHODS ====================

  /**
   * Generate JWT tokens
   */
  private async generateTokens(user: UserDocument): Promise<IAuthTokens> {
    const payload: IJwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '1d'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '1d'),
    };
  }

  /**
   * Remove sensitive fields
   */
  private sanitizeUser(user: UserDocument) {
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.emailVerificationCode;
    delete userObject.emailVerificationExpires;
    delete userObject.passwordResetCode;
    delete userObject.passwordResetExpires;
    delete userObject.refreshTokens;
    delete userObject.__v;
    return userObject;
  }
}