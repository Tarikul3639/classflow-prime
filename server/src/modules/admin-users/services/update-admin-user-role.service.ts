import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    User,
    UserDocument,
} from '../../../infrastructure/database/entities/user.entity';

import { UpdateAdminUserRoleDto } from '../dto/update-admin-user-role.dto';

import { AdminUserDto } from '../dto/admin-user.dto';

@Injectable()
export class UpdateAdminUserRoleService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async execute(
        userId: string,
        dto: UpdateAdminUserRoleDto,
    ) {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.status === 'BANNED') {
            throw new BadRequestException('Cannot update role of a banned user');
        }

        if (user.status === 'SUSPENDED') {
            throw new BadRequestException('Cannot update role of a suspended user');
        }

        if (user.role === dto.role) {
            throw new BadRequestException(`User already has the role ${dto.role}`);
        }

        // Update role

        user.role = dto.role;
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
            message: `User role updated to ${dto.role}`,
            data: response,
        };
    }
}
