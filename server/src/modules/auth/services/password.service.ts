import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../database/entities/user.entity';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { VerifyResetCodeDto } from '../dto/verify-reset-code.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { MailService } from '../../mail/services/mail.service';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  /**
   * Send password reset code
   */
  async sendPasswordResetCode(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    this.logger.log(`Password reset request for: ${email}`);

    const user = await this.userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      this.logger.warn(`Password reset failed: User not found - ${email}`);
      throw new NotFoundException('User not found');
    }

    // Rate limiting check
    if (user.passwordResetExpires) {
      const lastSent = new Date(
        user.passwordResetExpires.getTime() - 15 * 60 * 1000,
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

    // Generate 6-digit code
    const resetCode = user.createPasswordResetCode();
    await user.save();

    this.logger.log(`Password reset code generated for: ${user.email}`);

    // Send email
    try {
      await this.mailService.sendPasswordResetEmail(
        user.email,
        user.firstName,
        resetCode,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email: ${error.message}`,
      );
      throw new BadRequestException('Failed to send reset code');
    }

    return {
      message: 'Password reset code sent to your email',
    };
  }

  /**
   * Verify password reset code
   */
  async verifyPasswordResetCode(verifyResetCodeDto: VerifyResetCodeDto) {
    const { email, otp } = verifyResetCodeDto;

    this.logger.log(`Verifying reset code for: ${email}`);

    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
      passwordResetCode: otp,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      this.logger.warn(`Invalid or expired reset code for: ${email}`);
      throw new BadRequestException(
        'Invalid or expired reset code. Please request a new one.',
      );
    }

    this.logger.log(`Reset code verified for: ${user.email}`);

    return {
      message: 'Code verified successfully',
    };
  }

  /**
   * Reset password
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, code, newPassword } = resetPasswordDto;

    this.logger.log(`Password reset attempt for: ${email}`);

    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
      passwordResetCode: code,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      this.logger.warn(`Invalid or expired reset code for: ${email}`);
      throw new BadRequestException(
        'Invalid or expired reset code. Please request a new one.',
      );
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all sessions
    await user.save();

    this.logger.log(`Password reset successfully for: ${user.email}`);

    // Send password changed confirmation email
    try {
      await this.mailService.sendPasswordChangedEmail(
        user.email,
        user.firstName,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send password changed email: ${error.message}`,
      );
      // Don't throw - password was already changed, just email failed
    }

    return {
      message: 'Password reset successfully',
    };
  }
}