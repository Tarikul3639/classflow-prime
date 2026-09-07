import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../infrastructure/database/entities/user.entity';
import { UserStatus } from '../../../infrastructure/database/interface/user.interface';

import { AdminDashboardUserDto } from '../dto/admin-dashboard-user.dto';

@Injectable()
export class FetchAdminRecentUsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async fetchRecentUsers(limit: number): Promise<AdminDashboardUserDto[]> {
        const recentUsers = await this.userModel.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('_id name email role status emailVerified avatarUrl createdAt')
            .lean()

        return recentUsers.map((user) => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status ?? UserStatus.ACTIVE,
            emailVerified: user.emailVerified,
            avatarUrl: user.avatarUrl || null,
            createdAt: user.createdAt ?? new Date(),
        }));
    }
}