import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../../../../database/entities/user.entity';

@Injectable()
export class ValidateUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async execute(email: string, password: string): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    return user;
  }
}