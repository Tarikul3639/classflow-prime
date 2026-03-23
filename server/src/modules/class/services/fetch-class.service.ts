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
            {
                $match: {
                    _id: classObjectId,
                    $or: [{ instructorId: userObjectId }, { assistantIds: userObjectId }],
                },
            },
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
                        {
                            $count: 'total',
                        },
                    ],
                    as: 'studentCountArray',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'instructorId', // From Current class
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
            }, {
                $project: {
                    _id: 0,
                    classId: { $toString: "$_id" },
                    title: 1,
                    department: { $ifNull: ["$department", "General"] },
                    members: {
                        $add: [
                            { $ifNull: ["$studentCountArray.total", 0] }, // Student count from enrollments
                            { $size: { $ifNull: ["$assistantIds", []] } }, // Assistant count from class document
                            1, // Instructor count (always 1)
                        ]
                    },
                    instructor: { $ifNull: ["$instructorDetails.name", "Student"] },
                    avatarUrl: { $ifNull: ["$instructorDetails.avatarUrl", null] },
                    semester: { $ifNull: ["$semester", "TBA"] },
                    themeColor: "$themeColor",
                    coverImage: { $ifNull: ["$coverImage", null] },
                    status: { $ifNull: ["$status", "active"] },
                }
            }
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
