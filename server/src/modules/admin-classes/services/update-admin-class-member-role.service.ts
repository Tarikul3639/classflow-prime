import { Injectable, NotFoundException } from '@nestjs/common';
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

import { UpdateAdminClassMemberRoleDto } from '../dto/update-admin-class-member-role.dto';

@Injectable()
export class UpdateAdminClassMemberRoleService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<EnrollmentDocument>,
    ) { }

    async execute(classId: string, memberId: string, dto: UpdateAdminClassMemberRoleDto): Promise<void> {

        // 1. Validate IDs
        if (
            !Types.ObjectId.isValid(classId) ||
            !Types.ObjectId.isValid(memberId)
        ) {
            throw new NotFoundException('Invalid class or member ID');
        }

        const classObjectId = new Types.ObjectId(classId);
        const memberObjectId = new Types.ObjectId(memberId);

        // 2. Check class exists
        const classExists = await this.classModel.exists({
            _id: classObjectId,
        });

        if (!classExists) {
            throw new NotFoundException('Class not found');
        }

        // 3. Update member role
        const updateResult = await this.enrollmentModel.updateOne(
            {
                _id: memberObjectId,
                classId: classObjectId,
            },
            {
                $set: {
                    role: dto.role,
                },
            },
        );

        if (updateResult.matchedCount === 0) {
            throw new Error('Enrollment not found for the specified class');
        }
    }
}