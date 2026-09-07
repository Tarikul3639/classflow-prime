import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    Class,
    ClassDocument,
} from '../../../infrastructure/database/entities/class.entity';

import { UpdateAdminClassEnrollmentDto } from '../dto/update-admin-class-enrollment.dto';

@Injectable()
export class UpdateAdminClassEnrollmentService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    ) { }

    async execute(classId: string, dto: UpdateAdminClassEnrollmentDto): Promise<void> {
        const classObjectId = new Types.ObjectId(classId);

        const updateResult = await this.classModel.updateOne(
            { _id: classObjectId },
            {
                $set: {
                    allowEnroll: dto.allowEnroll,
                },
            },
        );

        if (updateResult.matchedCount === 0) {
            throw new Error('Class not found');
        }
    }
}