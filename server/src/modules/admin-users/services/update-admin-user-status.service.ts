import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    User,
    UserDocument,
} from '../../../infrastructure/database/entities/user.entity';

import {
    ActivityLog,
    ActivityLogDocument,
} from '../../../infrastructure/database/entities/activity-log.entity';

import {
    ActivityAction,
    ActivitySeverity,
    ActivityStatus,
} from '../../../infrastructure/database/interface/activity-log.interface';

import { UserStatus } from '../../../infrastructure/database/interface/user.interface';

import { UpdateAdminUserStatusDto } from '../dto/update-admin-user-status.dto';
import { AdminUserDto } from '../dto/admin-user.dto';

@Injectable()
export class UpdateAdminUserStatusService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(ActivityLog.name)
        private readonly activityLogModel: Model<ActivityLogDocument>,
    ) { }

    async execute(
        userId: string,
        dto: UpdateAdminUserStatusDto,
        adminUserId?: string,
    ) {
        const UserObjectId = new Types.ObjectId(userId);

        const user = await this.userModel.findById(UserObjectId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.status === dto.status) {
            throw new BadRequestException(`User is already ${dto.status}`);
        }

        const previousStatus = user.status;

        // Update status
        user.status = dto.status;
        await user.save();

        let action: ActivityAction;

        switch (dto.status) {
            case UserStatus.ACTIVE:
                action = ActivityAction.ACCOUNT_ACTIVATED;
                break;

            case UserStatus.SUSPENDED:
                action = ActivityAction.ACCOUNT_SUSPENDED;
                break;

            case UserStatus.BANNED:
                action = ActivityAction.ACCOUNT_BANNED;
                break;

            default:
                throw new BadRequestException('Invalid user status');
        }

        await this.activityLogModel.create({
            userId: user._id,
            action,
            severity:
                dto.status === UserStatus.BANNED
                    ? ActivitySeverity.CRITICAL
                    : ActivitySeverity.HIGH,

            status: ActivityStatus.SUCCESS,

            resource: 'User',
            resourceId: user._id.toString(),

            metadata: {
                previousStatus,
                newStatus: dto.status,
                adminUserId: adminUserId ?? null,
            },

            description: `User status changed from ${previousStatus} to ${dto.status}`,
            ipAddress: 'admin-panel',
        });

        // ==================== Response ====================

        const response: AdminUserDto = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified,
            avatarUrl: user.avatarUrl ?? null,
            bio: user.bio,
            createdAt: user.createdAt!,
            updatedAt: user.updatedAt!,
        };

        return {
            success: true,
            status: 200,
            message: `User status updated to ${dto.status}`,
            data: response,
        };
    }
}
