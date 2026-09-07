import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    User,
    UserDocument,
} from '../../../infrastructure/database/entities/user.entity';

import { AdminUserDto } from '../dto/admin-user.dto';

@Injectable()
export class VerifyAdminUserEmailService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async execute(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.emailVerified = true;
        await user.save();

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
            message: 'User email verified successfully',
            data: response,
        };
    }
}
