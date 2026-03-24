import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { Class, ClassDocument } from '../../../database/entities/class.entity';
import { FetchClassResponseDto } from '../dto/fetch-class.dto';

@Injectable()
export class FetchClassService {
    constructor(
        @InjectModel(Class.name)
        private readonly classModel: Model<ClassDocument>,
    ) { }

    async execute(
        userId: string,
        classId: string,
    ): Promise<FetchClassResponseDto> {
        const classObjectId = new Types.ObjectId(classId);
        const userObjectId = new Types.ObjectId(userId);

        const pipeline: PipelineStage[] = [
            // Step 1: Class খোঁজো
            {
                $match: {
                    _id: classObjectId,
                    isArchived: false,        // ← archived class দেখাবো না
                },
            },

            // Step 2: মোট enrolled student count
            {
                $lookup: {
                    from: 'enrollments',
                    let: { currentClassId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$classId', '$$currentClassId'],
                                },
                            },
                        },
                        { $count: 'total' },
                    ],
                    as: 'studentCountArray',
                },
            },

            // Step 3: Current user enrolled কিনা (userId ← schema অনুযায়ী)
            {
                $lookup: {
                    from: 'enrollments',
                    let: { currentClassId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$classId', '$$currentClassId'] },
                                        { $eq: ['$userId', userObjectId] },  // ← schema: userId
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'currentUserEnrollment',
                },
            },

            // Step 4: Instructor details (schema: name, avatarUrl)
            {
                $lookup: {
                    from: 'users',
                    localField: 'instructorId',
                    foreignField: '_id',
                    as: 'instructorDetails',
                },
            },
            {
                $unwind: {
                    path: '$instructorDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$studentCountArray',
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Step 5: Access check — instructor/assistant/enrolled student
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$instructorId', userObjectId] },
                            { $in: [userObjectId, { $ifNull: ['$assistantIds', []] }] },
                            { $gt: [{ $size: '$currentUserEnrollment' }, 0] },
                        ],
                    },
                },
            },

            // Step 6: Project
            {
                $project: {
                    _id: 0,
                    classId: { $toString: '$_id' },
                    name: '$name',                                          // ← schema: name (title না)
                    department: { $ifNull: ['$department', 'General'] },
                    semester: { $ifNull: ['$semester', 'TBA'] },
                    about: { $ifNull: ['$about', null] },                  // ← schema: about
                    themeColor: '$themeColor',
                    coverImage: { $ifNull: ['$coverImage', null] },
                    status: { $ifNull: ['$status', 'active'] },
                    allowEnroll: '$allowEnroll',                           // ← schema: allowEnroll

                    // Members count
                    members: {
                        $add: [
                            { $ifNull: ['$studentCountArray.total', 0] },  // enrolled students
                            { $size: { $ifNull: ['$assistantIds', []] } }, // assistants
                            1,                                              // instructor
                        ],
                    },

                    // Instructor info (schema: name, avatarUrl)
                    instructor: { $ifNull: ['$instructorDetails.name', 'Unknown'] },
                    avatarUrl: { $ifNull: ['$instructorDetails.avatarUrl', null] },

                    // Current user role
                    isInstructor: { $eq: ['$instructorId', userObjectId] },
                    isAssistant: {
                        $in: [userObjectId, { $ifNull: ['$assistantIds', []] }]
                    },
                },
            },
        ];

        const classData = await this.classModel.aggregate(pipeline).exec();

        if (classData.length === 0) {
            return {
                success: false,
                message: 'Class not found or access denied',
                data: { class: null },
            };
        }

        return {
            success: true,
            message: 'Class fetched successfully',
            data: { class: classData[0] },
        };
    }
}
