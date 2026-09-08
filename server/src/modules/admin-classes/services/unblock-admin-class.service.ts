import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    Class,
    ClassDocument,
} from '../../../infrastructure/database/entities/class.entity';

@Injectable()
export class UnBlockAdminClassService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    ) { }

    async execute(classId: string, isBlocked: boolean): Promise<void> {
        const classObjectId = new Types.ObjectId(classId);

        const updateResult = await this.classModel.updateOne(
            { _id: classObjectId },
            {
                $set: {
                    isBlocked: isBlocked,
                    blockedReason: null,
                    blockedAt: null,
                    blockedBy: null,
                },
            },
        );

        if (updateResult.matchedCount === 0) {
            throw new Error('Class not found');
        }
    }
}
