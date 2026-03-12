import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../database/entities/user.entity';
import { ICurrentUserResponse } from '../interfaces/auth.interface';
import { UserSanitizerService } from './user-sanitizer.service';

/**
 * CurrentUserService
 * Retrieves current authenticated user's profile
 */
@Injectable()
export class CurrentUserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userSanitizer: UserSanitizerService,
  ) {}

  /**
   * Get current user by ID
   * @param userId - User's MongoDB ID
   * @returns Sanitized user data
   */
  async execute(userId: string): Promise<ICurrentUserResponse> {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: this.userSanitizer.sanitize(user),
    };
  }
}