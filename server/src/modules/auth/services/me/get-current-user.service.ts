import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../../../../database/entities/user.entity';

@Injectable()
export class GetCurrentUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async execute(userId: string) {
    const user: UserDocument | null = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user as User;
  }
}