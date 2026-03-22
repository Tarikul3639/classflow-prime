import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, PipelineStage } from "mongoose";
import { Class, ClassDocument } from "src/database/entities/class.entity";
import { Enrollment, EnrollmentDocument } from "src/database/entities/enrollment.entity";
import { JoinClassRequestDto, JoinClassResponseDto } from "../dto/join-class.dto";
import { EnrollmentRole } from 'src/database/interface/enrollment.interface';

@Injectable()
export class JoinClassService {
    constructor(
        @InjectModel(Class.name)
        private readonly classModel: Model<ClassDocument>,
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<EnrollmentDocument>,
    ) { }

    async execute(userId: string, dto: JoinClassRequestDto): Promise<JoinClassResponseDto> {
        const userObjId = new Types.ObjectId(userId);

        // 1. Single Pipeline Validation
        const pipeline: PipelineStage[] = [
            { $match: { joinCode: dto.joinCode } },
            {
                $lookup: {
                    from: 'enrollments',
                    let: { cid: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$classId', '$$cid'] },
                                        { $eq: ['$userId', userObjId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'userEnrollment'
                }
            },
            {
                $project: {
                    name: 1,
                    allowJoin: 1,
                    isArchived: 1,
                    instructorId: 1,
                    assistantIds: 1,
                    isAlreadyEnrolled: { $gt: [{ $size: '$userEnrollment' }, 0] },
                    isInstructor: {
                        $or: [
                            { $eq: ['$instructorId', userObjId] },
                            { $in: [userObjId, { $ifNull: ['$assistantIds', []] }] }
                        ]
                    }
                }
            }
        ];

        const classInfo = await this.classModel.aggregate(pipeline).exec().then(results => results[0]);

        // 2. Run Business Logic Checks
        if (!classInfo) {
            return {
                success: false,
                message: "Invalid join code. Class not found.",
                data: { classId: null }
            };
        }

        if (classInfo.isAlreadyEnrolled) {
            return {
                success: false,
                message: "You are already a member of this class.",
                data: { classId: classInfo._id.toString() }
            };
        }

        if (classInfo.isInstructor) {
            return {
                success: false,
                message: "Teacher or Assistants cannot join as students.",
                data: { classId: classInfo._id.toString() }
            };
        }

        if (!classInfo.allowJoin || classInfo.isArchived) {
            return {
                success: false,
                message: "This class is currently closed for new joins.",
                data: { classId: classInfo._id.toString() }
            };
        }

        // 3. Perform the Write Operation
        try {
            await this.enrollmentModel.create({
                userId: userObjId,
                classId: classInfo._id,
                role: EnrollmentRole.LEARNER,
                joinedAt: new Date()
            });

            return {
                success: true,
                message: `Successfully joined ${classInfo.name}`,
                data: { classId: classInfo._id.toString() }
            };
        } catch (error) {
            return {
                success: false,
                message: "Enrollment failed. Please try again later.",
                data: { classId: classInfo._id.toString() }
            };
        }
    }
}