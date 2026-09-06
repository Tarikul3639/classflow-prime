import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  User,
  UserDocument,
} from '../../../infrastructure/database/entities/user.entity';

import { UserGrowthDto } from '../dto/user-growth.dto';

@Injectable()
export class FetchUserGrowthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async execute(): Promise<UserGrowthDto[]> {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);

    const users = await this.userModel
      .find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      })
      .select('createdAt')
      .lean();

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const userGrowth: UserGrowthDto[] = months.map((month) => ({
      month,
      users: 0,
    }));

    users.forEach((user) => {
      if (!user.createdAt) {
        return;
      }

      const monthIndex = new Date(user.createdAt).getMonth();
      userGrowth[monthIndex].users += 1;
    });

    return userGrowth;
  }
}
