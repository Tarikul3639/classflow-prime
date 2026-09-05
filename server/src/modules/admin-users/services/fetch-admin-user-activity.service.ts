import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    User,
    UserDocument,
} from '../../../infrastructure/database/entities/user.entity';

import {
    ActivityLog,
    ActivityLogDocument,
} from '../../../infrastructure/database/entities/activity-log.entity';

@Injectable()
export class FetchAdminUserActivityService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(ActivityLog.name)
        private readonly activityLogModel: Model<ActivityLogDocument>,
    ) { }

    async execute(
        userId: string,
        limit = 50,
    ) {
        // ==================== Check User ====================

        const userExists = await this.userModel.exists({
            _id: userId,
        });

        if (!userExists) {
            throw new NotFoundException('User not found');
        }

        // ==================== Fetch Activity ====================

        return this.activityLogModel
            .find({
                userId,
            })
            .sort({
                createdAt: -1,
            })
            .limit(limit)
            .lean();
    }
}