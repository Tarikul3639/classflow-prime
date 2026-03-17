import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../../../../database/entities/user.entity';
import {
  Account,
  AccountDocument,
} from '../../../../database/entities/account.entity';
import { AccountProvider } from '../../../../database/interface/account.interface';

@Injectable()
export class ValidateUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) { }

  async execute(email: string, password: string): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.userModel.findOne({
      email: email.toLowerCase(),
    });
    if (!user) return null;
    const account = await this.accountModel
      .findOne({
        userId: user._id,
        providerId: AccountProvider.PASSWORD,
      })
      .select('+password');
    if (!account || !account.password) return null;

    const ok = await bcrypt.compare(password, account.password);
    if (!ok) return null;

    return user;
  }
}
