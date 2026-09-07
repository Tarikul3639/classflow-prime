import { Injectable } from '@nestjs/common';

import { ApiResponseDto } from '../../../common/dto/api-response.dto';
import { AdminUserStatsDto } from '../dto/admin-user-stats.dto';
import { User, UserDocument } from '../../../infrastructure/database/entities/user.entity';
import { UserStatus } from '../../../infrastructure/database/interface/user.interface';
import { UserRole } from '../../../infrastructure/database/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FetchAdminUserStatsService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async execute(): Promise<ApiResponseDto<AdminUserStatsDto>> {
        console.log("Calling...");
        const totalUsers = await this.userModel.countDocuments();
        const verifiedUsers = await this.userModel.countDocuments({ isEmailVerified: true });
        const unverifiedUsers = await this.userModel.countDocuments({ isEmailVerified: false });
        const adminUsers = await this.userModel.countDocuments({ role: UserRole.ADMIN });
        const normalUsers = await this.userModel.countDocuments({ role: UserRole.USER });
        const bannedUsers = await this.userModel.countDocuments({ status: UserStatus.BANNED });

        return {
            success: true,
            message: 'Admin user stats fetched successfully',
            status: 200,
            data: {
                totalUsers,
                verifiedUsers,
                unverifiedUsers,
                adminUsers,
                normalUsers,
                bannedUsers,
            },
        };
    }
}