import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../database/entities/user.entity';

/**
 * ValidateUserService
 * Validates user credentials (used by LocalStrategy)
 */
@Injectable()
export class ValidateUserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Validate user email and password
   * @param email - User email
   * @param password - User password
   * @returns User document if valid
   */
  async execute(email: string, password: string): Promise<UserDocument> {
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
}