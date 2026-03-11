import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import type {
  IUserDocument,
  IUserModel,
} from 'src/database/interface/user.interface';
import { SignUpDto } from '../dto/signup.dto';
import { IAuthTokens, ISignUpResponse } from '../interfaces/auth.interface';
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
    @InjectModel('User') private userModel: Model<IUserDocument> & IUserModel,
    private jwtService: JwtService,
    private configService: ConfigService,
    // private mailService: MailService, // Assuming you have a MailService for sending emails
  ) {}

  // ==================== SIGNUP (User Registration) ====================

  /**
   * Register a new user account
   * Steps:
   * 1. Check if email already exists
   * 2. Create new user with hashed password (handled by pre-save middleware)
   * 3. Generate email verification token
   * 4. Send verification email
   * 5. Generate JWT access & refresh tokens
   * 6. Return user data and tokens
   *
   * @param signupDto - User registration data
   * @returns User object and authentication tokens
   * @throws ConflictException if email already exists
   */

  async signUp(signupDto: SignUpDto): Promise<ISignUpResponse> {
    const { email, password, firstName, avatarUrl } = signupDto;

    // 1. Check if email already exists
    const existingUser = await this.userModel.findByEmail(email);

    if (existingUser) {
      this.logger.warn(`Signup failed: Email already exists - ${email}`);
      throw new ConflictException('User with this email already exists');
    }

    // 2. Create new user (password hashing is handled by pre-save middleware)
    const newUser = new this.userModel({
      email,
      password,
      firstName,
      avatarUrl,
    });

    // Generate email verification token
    const verificationToken = newUser.createEmailVerificationToken();

    // Save user to database
    await newUser.save();

    // 3. Send verification email (assuming MailService is implemented)
    this.logger.log(
      `User created successfully: ${newUser.email} (ID: ${newUser._id})`,
    );

    // Send verification email (non-blocking)
    // this.mailService
    //   .sendVerificationEmail(newUser.email, newUser.firstName, verificationToken)
    //   .catch((error) => {
    //     this.logger.error(
    //       `Failed to send verification email to ${newUser.email}: ${error.message}`,
    //     );
    //   });

    // Generate authentication tokens
    const tokens = await this.generateTokens(newUser);

    // Store refresh token in user document
    await newUser.addRefreshToken(tokens.refreshToken);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
      user: newUser,
      tokens,
    };
  }

  // ==================== HELPER METHODS ====================

  /**
   * Generate JWT access and refresh tokens
   *
   * @param user - User document
   * @returns Object containing access and refresh tokens
   */
  private async generateTokens(user: IUserDocument): Promise<IAuthTokens> {
    const payload: IJwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    // Access Token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.accessToken.secret'),
      expiresIn: this.configService.get('jwt.accessToken.expiresIn'),
    });

    // Refresh Token
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshToken.secret'),
      expiresIn: this.configService.get('jwt.refreshToken.expiresIn'),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('jwt.accessToken.expiresIn') as string,
    };
  }
}
