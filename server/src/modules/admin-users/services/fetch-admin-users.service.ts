import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    User,
    UserDocument,
} from '../../../infrastructure/database/entities/user.entity';

import { AdminUserQueryDto } from '../dto/admin-user-query.dto';
import { AdminUserDto } from '../dto/admin-user.dto';
import { AdminUserResponseDto } from '../dto/admin-user-response.dto';

@Injectable()
export class FetchAdminUsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async execute(query: AdminUserQueryDto) {
        const {
            page = 1,
            limit = 20,
            search,
            role,
            status,
            emailVerified,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        const filter: any = {};

        if (search && search.trim() !== '') {
            const searchTerm = search.trim();
            filter.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        if (role && role.trim() !== '') {
            filter.role = role;
        }

        if (status && status.trim() !== '') {
            filter.status = status;
        }

        if (emailVerified !== undefined && emailVerified !== null) {
            filter.emailVerified = emailVerified;
        }

        //Pagination
        const skip = (page - 1) * limit;

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };

        const [users, total] = await Promise.all([
            this.userModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select(
                    '_id name email role status emailVerified avatarUrl bio createdAt updatedAt',
                )
                .lean(),

            this.userModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit);

        const mappedUsers: AdminUserDto[] = users.map((user) => ({
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
        }));

        const response: AdminUserResponseDto = {
            users: mappedUsers,
            total,
            page,
            limit,
            totalPages,
        };

        return {
            success: true,
            status: 200,
            message: 'Users fetched successfully',
            data: response,
        };
    }
}