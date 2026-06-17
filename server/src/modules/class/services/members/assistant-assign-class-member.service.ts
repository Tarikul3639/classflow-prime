import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Class, ClassDocument } from '../../../../infrastructure/database/entities/class.entity';
import { Enrollment, EnrollmentDocument } from '../../../../infrastructure/database/entities/enrollment.entity';
import { User, UserDocument } from '../../../../infrastructure/database/entities/user.entity';
import { EnrollmentRole } from '../../../../infrastructure/database/interface/enrollment.interface';
import { AssignAssistantRequestDto, AssignAssistantResponseDto } from '../../dto/class-member.dto';

@Injectable()
export class AssistantAssignClassMemberService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
        @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<EnrollmentDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async execute(
        userId: string,
        classId: string,
        dto: AssignAssistantRequestDto,
    ): Promise<AssignAssistantResponseDto> {

        if (userId === dto.userId) {
            throw new BadRequestException('You cannot assign yourself as assistant');
        }

        const classObjectId = new Types.ObjectId(classId);
        const userObjectId = new Types.ObjectId(dto.userId);

        // Validate existence in parallel for better performance
        const [existsClass, existsUser, enrollment] = await Promise.all([
            this.classModel.exists({ _id: classObjectId }),
            this.userModel.exists({ _id: userObjectId }),
            this.enrollmentModel.findOne({ classId: classObjectId, userId: userObjectId }),
        ]);

        if (!existsClass) throw new NotFoundException('Class not found');
        if (!existsUser) throw new NotFoundException('User not found');
        if (!enrollment) throw new NotFoundException('User is not enrolled in this class');

        if (enrollment.role === EnrollmentRole.ASSISTANT) {
            throw new BadRequestException('User is already an assistant');
        }

        // Update role
        enrollment.role = EnrollmentRole.ASSISTANT;
        await enrollment.save();

        return {
            success: true,
            message: 'Assistant assigned successfully',
            data: { userId: dto.userId },
        };
    }
}