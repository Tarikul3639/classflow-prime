import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserStatus } from '../../../database/entities/user.entity';
import { SignUpDto } from '../dto/signup.dto';
import { ISignUpResponse } from '../interfaces/auth.interface';
import { MailService } from '../../mail/services/mail.service';
import { TokenService } from './token.service';
import { UserSanitizerService } from './user-sanitizer.service';
import { EmailValidator } from '../../../shared/utils/email-validator.util';

/**
 * SignUpService
 * Handles user registration logic
 */
@Injectable()
export class SignUpService {
  private readonly logger = new Logger(SignUpService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
    private tokenService: TokenService,
    private userSanitizer: UserSanitizerService,
  ) {}

  async execute(signUpDto: SignUpDto): Promise<ISignUpResponse> {
    this.logger.log(`Signup attempt for email: ${signUpDto.email}`);

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
    } = signUpDto;

    // 1. Validate email domain
    EmailValidator.validateOrThrow(email);

    // 2. Check if email already exists
    const existingUser = await this.userModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      this.logger.warn(`Signup failed: Email already exists - ${email}`);
      throw new ConflictException('User with this email already exists');
    }

    // 3. Check if username is already taken
    if (username) {
      const existingUsername = await this.userModel.findOne({ username });
      if (existingUsername) {
        this.logger.warn(`Signup failed: Username already taken - ${username}`);
        throw new ConflictException('Username is already taken');
      }
    }

    // 4. Start MongoDB transaction
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      // 5. Create new user
      const user = new this.userModel({
        email: email.toLowerCase(),
        password,
        firstName,
        lastName,
        username,
        role: role || undefined,
        phone,
        studentId,
        department,
        avatarUrl,
        status: UserStatus.PENDING_VERIFICATION,
        isEmailVerified: false,
      });

      // 6. Generate verification code
      const verificationCode = user.createEmailVerificationCode();

      // 7. Save user
      await user.save({ session });

      this.logger.log(
        `User created in transaction: ${user.email} (ID: ${user._id}, Code: ${verificationCode})`,
      );

      // 8. Send verification email (BEFORE commit)
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
        throw new InternalServerErrorException(
          'Failed to send verification email. Please try again later.',
        );
      }

      // 9. Commit transaction
      await session.commitTransaction();
      session.endSession();

      this.logger.log(`Transaction committed: User ${user.email} registered successfully`);

      // 10. Generate tokens
      const tokens = await this.tokenService.generateTokens(user);

      // 11. Store refresh token
      await user.addRefreshToken(tokens.refreshToken);

      // 12. Return response
      return {
        message:
          'Registration successful. Please check your email for a 6-digit verification code.',
        user: this.userSanitizer.sanitize(user),
        tokens,
      };
    } catch (error) {
      // Rollback transaction
      await session.abortTransaction();
      session.endSession();

      this.logger.error(`Signup failed, transaction rolled back: ${error.message}`);

      // Re-throw known exceptions
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to create user account');
    }
  }
}