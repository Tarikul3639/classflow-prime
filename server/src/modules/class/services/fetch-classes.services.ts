import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { Class, ClassDocument } from '../../../database/entities/class.entity';
import { FetchClassesResponseDto } from '../dto/fetch-classes.dto';

@Injectable()
export class FetchClassesService {
    constructor(
        @InjectModel(Class.name)
        private readonly classModel: Model<ClassDocument>,
    ) { }

    async execute(userId: string): Promise<FetchClassesResponseDto> {
        const userObjectId = new Types.ObjectId(userId);

        const pipeline: PipelineStage[] = [
            {
                // 1. Initial Match: Instructor or Assistant
                $match: {
                    $or: [{ instructorId: userObjectId }, { assistants: userObjectId }],
                },
            },
            {
                // 2. Advanced Lookup with 'let' for Student Count
                $lookup: {
                    from: 'enrollments',
                    let: { currentClassId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$classId', '$$currentClassId'] } } },
                        { $count: 'total' },
                    ],
                    as: 'studentCountArray',
                },
            },
            {
                // 3. Lookup Instructor Details
                $lookup: {
                    from: 'users',
                    localField: 'instructorId',
                    foreignField: '_id',
                    as: 'instructorDetails',
                },
            },
            { $unwind: { path: '$instructorDetails', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$studentCountArray', preserveNullAndEmptyArrays: true } },
            {
                // 4. Final Projection to Match DTO
                $project: {
                    _id: 0,
                    classId: { $toString: '$_id' },
                    title: '$name',
                    department: { $ifNull: ['$department', 'General'] },
                    students: { $ifNull: ['$studentCountArray.total', 0] },
                    instructor: { $ifNull: ['$instructorDetails.name', 'Staff'] },
                    avatarUrl: { $ifNull: ['$instructorDetails.avatarUrl', null] },
                    semester: { $ifNull: ['$semester', 'TBA'] },
                    themeColor: '$themeColor',
                    coverImage: '$coverImage',
                    status: {
                        $cond: { if: { $eq: ['$isArchived', true] }, then: 'archived', else: 'active' }
                    },

                },
            },
        ];

        const classes = await this.classModel.aggregate(pipeline).exec();

        return {
            success: true,
            message: 'Classes fetched successfully',
            data: { classes }
        };
    }
}
