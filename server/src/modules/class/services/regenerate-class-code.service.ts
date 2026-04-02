// regenerate-class-code.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { customAlphabet } from 'nanoid';

import { Class, ClassDocument } from '../../../database/entities/class.entity';
import { ClassCodeResponseDto } from '../dto/class-settings.dto';

@Injectable()
export class RegenerateClassCodeService {
    constructor(
        @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    ) { }

    private generateCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

    async execute(userId: string, classId: string): Promise<ClassCodeResponseDto> {
        const userObjectId = new Types.ObjectId(userId);
        const classObjectId = new Types.ObjectId(classId);

        // Check if class exists
        const existingClass = await this.classModel.findById(classId);
        if (!existingClass) throw new NotFoundException('Class not found');

        // Only instructor can regenerate code
        if (!existingClass.instructorId.equals(userObjectId)) {
            throw new ForbiddenException('Only the instructor can regenerate the class code');
        }

        let newCode: string;
        let exists: boolean;

        do {
            newCode = this.generateCode();
            exists = !!(await this.classModel.exists({ enrollCode: newCode }));
        } while (exists);

        // Update the class with the unique code
        await this.classModel.findByIdAndUpdate(classId, { $set: { enrollCode: newCode } });

        return {
            success: true,
            message: 'Class code regenerated successfully.',
            data: { code: newCode },
        };
    }
}