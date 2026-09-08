import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    Class,
    ClassDocument,
} from '../../../infrastructure/database/entities/class.entity';

import { BlockAdminClassDto } from '../dto/block-admin-class.dto';

@Injectable()
export class BlockAdminClassService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    ) { }

    async execute(userId: string, classId: string, dto: BlockAdminClassDto): Promise<void> {
        const classObjectId = new Types.ObjectId(classId);
        const userObjectId = new Types.ObjectId(userId);

        const updateResult = await this.classModel.updateOne(
            { _id: classObjectId },
            {
                $set: {
                    isBlocked: dto.isBlocked,
                    blockedReason: dto.blockedReason ?? 'Violation of class rules',
                    blockedAt: new Date(),
                    blockedBy: userObjectId,
                },
            },
        );

        if (updateResult.matchedCount === 0) {
            throw new Error('Class not found');
        }
    }
}
