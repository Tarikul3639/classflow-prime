import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../../database/entities/user.entity';

@Injectable()
export class SignOutService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async execute(userId: string, refreshToken?: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (!refreshToken) {
      // if not provided => signout all
      user.refreshTokens = [];
      await user.save();
      return { message: 'Signed out from all devices' };
    }

    user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== refreshToken);
    await user.save();
    return { message: 'Signout successful' };
  }

  async signOutAll(userId: string) {
    return this.execute(userId, undefined);
  }
}