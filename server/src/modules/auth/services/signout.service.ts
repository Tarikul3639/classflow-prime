import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../database/entities/user.entity';
import { ISignOutResponse } from '../interfaces/auth.interface';

/**
 * SignOutService
 * Handles user sign-out logic
 */
@Injectable()
export class SignOutService {
  private readonly logger = new Logger(SignOutService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Signs out a user by removing refresh token(s)
   * @param userId - User's MongoDB ID
   * @param refreshToken - Optional specific refresh token to remove
   * @returns Confirmation message
   * @throws NotFoundException if user does not exist
   */
  async execute(userId: string, refreshToken?: string): Promise<ISignOutResponse> {
    this.logger.log(`Sign out request for user: ${userId}`);

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      this.logger.warn(`Sign out failed: User not found - ${userId}`);
      throw new NotFoundException('User not found');
    }

    if (refreshToken) {
      await user.removeRefreshToken(refreshToken);
      this.logger.log(`Refresh token removed for user: ${userId}`);
    } else {
      user.refreshTokens = [];
      await user.save();
      this.logger.log(`All refresh tokens removed for user: ${userId}`);
    }

    return {
      message: 'Sign out successful',
    };
  }
}