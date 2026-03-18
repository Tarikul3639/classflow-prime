import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';

import { User, UserDocument } from '../../../../database/entities/user.entity';

export interface IGetCurrentUserResponse {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  bio?: string;
  avatarUrl?: string;
  enrolledClasses: {
    classId: string;
    className: string;
    role: string;
    status: string;
    joinedAt: Date;
  }[];
}

@Injectable()
export class GetCurrentUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async execute(userId: string): Promise<IGetCurrentUserResponse> {
    // 1. Convert string ID to MongoDB ObjectId
    const userObjId = new Types.ObjectId(userId);

    const pipeline: PipelineStage[] = [
      // Stage 1: Match the specific user
      { $match: { _id: userObjId } },

      // Stage 2: Join with Enrollments
      {
        $lookup: {
          from: 'enrollments', // NOTE: collection name in DB
          localField: '_id', // NOTE: current user id
          foreignField: 'userId', // NOTE: field in enrollments that references user
          as: 'enrollments', // NOTE: output array field for matched enrollments
        },
      },

      // Stage 3: Join with Classes (Nested Lookup)
      {
        $lookup: {
          from: 'classes',
          localField: 'enrollments.classId', // current class IDs from enrollments
          foreignField: '_id', // field in classes that references class ID
          as: 'classDetails',
        },
      },

      // Stage 4: Projection to format the output
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          emailVerified: 1,
          bio: 1,
          avatarUrl: 1,
          enrolledClasses: {
            /**
             * $map: {
             *  input: <array>,
             *  as: <variable name>,
             *  in: <output format for each element>
             *}
             */
            $map: {
              input: '$enrollments',
              as: 'enroll', 
              in: {
                classId: '$$enroll.classId',
                role: '$$enroll.role',
                joinedAt: '$$enroll.joinedAt',
                // Find matching class name and status from classDetails array
                className: {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          /**
                           * $filter: {
                           *  input: <array>,
                           *  as: <variable name>,
                           *  cond: <condition>,
                           *  limit: <optional>
                           *}
                           */
                          $filter: {
                            input: '$classDetails',
                            as: 'cls',
                            cond: { $eq: ['$$cls._id', '$$enroll.classId'] },
                          },
                        },
                        as: 'matchedCls',
                        in: '$$matchedCls.name',
                      },
                    },
                    0,
                  ],
                },
                status: {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: '$classDetails',
                            as: 'cls',
                            cond: { $eq: ['$$cls._id', '$$enroll.classId'] },
                          },
                        },
                        as: 'matchedCls',
                        in: '$$matchedCls.status',
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
    ];

    // 2. Optimized User & Enrollment Fetch using Aggregation
    const result: IGetCurrentUserResponse[] =
      await this.userModel.aggregate(pipeline);

    if (!result || result.length === 0) {
      throw new NotFoundException('User profile not found');
    }

    const userData = result[0]; // mongoose aggregate always returns an array even if it's just one document

    // 3. Final sanitization for response
    return {
      _id: userData._id.toString(),
      name: userData.name,
      email: userData.email,
      emailVerified: userData.emailVerified,
      bio: userData.bio,
      avatarUrl: userData.avatarUrl || undefined,
      enrolledClasses: userData.enrolledClasses || [],
    };
  }
}
