import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import type { UserDocument } from '../../../infrastructure/database/entities/user.entity';

import {
    Class,
    ClassDocument,
} from '../../../infrastructure/database/entities/class.entity';

import {
    Enrollment,
    EnrollmentDocument,
} from '../../../infrastructure/database/entities/enrollment.entity';

import {
    AdminClassMembersDto,
    AdminClassMemberDto,
} from '../dto/admin-class-members-response.dto';

@Injectable()
export class FetchAdminClassMembersService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<EnrollmentDocument>,
    ) { }

    async execute(classId: string): Promise<AdminClassMembersDto> {
        const classObjectId = new Types.ObjectId(classId);

        // Fetch the class details
        const classDetails = await this.classModel.findById(classObjectId).lean();

        if (!classDetails) {
            throw new Error('Class not found');
        }

        const [enrollments, total] = await Promise.all([
            this.enrollmentModel
                .find({ classId: classObjectId })
                .populate<{ userId: UserDocument }>({
                    path: 'userId',
                    select: 'name email avatarUrl emailVerified status',
                })
                .sort({
                    enrolledAt: -1,
                })
                .lean(),

            this.enrollmentModel.countDocuments({ classId: classObjectId }),
        ]);

        const members: AdminClassMemberDto[] = enrollments
            .filter((enrollment) => enrollment.userId)
            .map((enrollment) => ({
                enrollmentId: enrollment._id.toString(),
                userId: enrollment.userId._id.toString(),
                name: enrollment.userId.name,
                email: enrollment.userId.email,
                avatarUrl: enrollment.userId.avatarUrl || null,
                emailVerified: enrollment.userId.emailVerified,
                userStatus: enrollment.userId.status,
                role: enrollment.role,
                enrolledAt: enrollment.enrolledAt,
            }));

        return {
            success: true,
            status: 200,
            message: 'Successfully fetched class members',
            data: {
                members,
                pagination: {
                    total,
                    page: 1,
                    limit: total, // Since we are fetching all members, the limit is set to total
                    totalPages: 1,
                },
            },
        };
    }
}
