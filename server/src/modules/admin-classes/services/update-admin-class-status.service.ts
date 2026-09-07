import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    Class,
    ClassDocument,
} from '../../../infrastructure/database/entities/class.entity';

import { UpdateAdminClassStatusDto } from '../dto/update-admin-class-status.dto';

@Injectable()
export class UpdateAdminClassStatusService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    ) { }

    async execute(classId: string, dto: UpdateAdminClassStatusDto): Promise<void> {
        const classObjectId = new Types.ObjectId(classId);

        const updateResult = await this.classModel.updateOne(
            { _id: classObjectId },
            {
                $set: {
                    status: dto.status,
                },
            },
        );

        if (updateResult.matchedCount === 0) {
            throw new Error('Class not found');
        }
    }
}