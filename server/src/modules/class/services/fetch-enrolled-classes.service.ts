import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { Class, ClassDocument } from '../../../database/entities/class.entity';
import { FetchClassesResponseDto } from '../dto/fetch-enrolled-classes.dto';

@Injectable()
export class FetchEnrolledClassesService {
  constructor(
    @InjectModel(Class.name)
    private readonly classModel: Model<ClassDocument>,
  ) {}

  async execute(userId: string): Promise<FetchClassesResponseDto> {
    const userObjectId = new Types.ObjectId(userId);

    const pipeline: PipelineStage[] = [
      // Step 1: Current user enrolled কিনা আগে check করো
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
                    { $eq: ['$userId', userObjectId] }, // ← schema: userId
                  ],
                },
              },
            },
          ],
          as: 'currentUserEnrollment',
        },
      },

      // Step 2: Access check — instructor/assistant/student
      {
        $match: {
          $expr: {
            $or: [
              { $eq: ['$instructorId', userObjectId] },
              { $in: [userObjectId, { $ifNull: ['$assistantIds', []] }] }, // ← assistantIds
              { $gt: [{ $size: '$currentUserEnrollment' }, 0] }, // ← student
            ],
          },
        },
      },

      // Step 3: মোট student count
      {
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

      // Step 4: Instructor details
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

      // Step 5: Project
      {
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
          coverImage: { $ifNull: ['$coverImage', null] },
          status: {
            $cond: {
              if: { $eq: ['$isArchived', true] },
              then: 'archived',
              else: 'active',
            },
          },
          isInstructor: { $eq: ['$instructorId', userObjectId] }, // ← bonus
        },
      },
    ];

    const classes = await this.classModel.aggregate(pipeline).exec();

    return {
      success: true,
      message: 'Classes fetched successfully',
      data: { classes },
    };
  }
}
