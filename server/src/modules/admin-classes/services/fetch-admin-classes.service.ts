import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    Class,
    ClassDocument,
} from '../../../infrastructure/database/entities/class.entity';

import {
    Enrollment,
    EnrollmentDocument,
} from '../../../infrastructure/database/entities/enrollment.entity';

import { EnrollmentRole } from '../../../infrastructure/database/interface/enrollment.interface';

import { AdminClassDto, AdminClassesDto } from '../dto/admin-classes.dto';
import { AdminClassQueryDto } from '../dto/admin-class-query.dto';

interface PopulatedUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    avatarUrl?: string | null;
}

@Injectable()
export class FetchAdminClassesService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<EnrollmentDocument>,
    ) { }

    async execute(query: AdminClassQueryDto): Promise<AdminClassesDto> {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        const filter: any = {};

        if (search && search.trim() !== '') {
            filter.$or = [
                { className: { $regex: search, $options: 'i' } },
                { enrollCode: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { semester: { $regex: search, $options: 'i' } },
            ];
        }

        if (status && status.trim() !== '') {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };

        const [classes, total] = await Promise.all([
            this.classModel
                .find(filter)
                .populate({
                    path: 'createdBy',
                    select: 'name email avatarUrl',
                })
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.classModel.countDocuments(filter).exec(),
        ]);

        const totalPages = Math.ceil(total / limit);

        const adminClasses: AdminClassDto[] = await Promise.all<AdminClassDto>(
            classes.map(async (cls) => {
                const createdBy = cls.createdBy as unknown as PopulatedUser;

                const [totalMembers, totalTeachers, totalLearners] = await Promise.all([
                    this.enrollmentModel.countDocuments({
                        classId: cls._id,
                    }),

                    this.enrollmentModel.countDocuments({
                        classId: cls._id,
                        role: EnrollmentRole.INSTRUCTOR,
                    }),

                    this.enrollmentModel.countDocuments({
                        classId: cls._id,
                        role: EnrollmentRole.LEARNER,
                    }),
                ]);

                return {
                    _id: cls._id.toString(),
                    className: cls.className,
                    enrollCode: cls.enrollCode,
                    department: cls.department,
                    semester: cls.semester,
                    themeColor: cls.themeColor,
                    coverImage: cls.coverImage || null,
                    status: cls.status,
                    allowEnroll: cls.allowEnroll,
                    isBlocked: cls.isBlocked || false,

                    createdBy: createdBy
                        ? {
                            _id: createdBy._id.toString(),
                            name: createdBy.name,
                            email: createdBy.email,
                            avatarUrl: createdBy.avatarUrl || null,
                        }
                        : null,

                    createdAt: cls.createdAt!,
                    updatedAt: cls.updatedAt!,

                    totalMembers,
                    totalTeachers,
                    totalLearners,
                };
            }),
        );

        return {
            success: true,
            message: 'Successfully fetched admin classes',
            status: 200,
            data: {
                classes: adminClasses,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            },
        };
    }
}
