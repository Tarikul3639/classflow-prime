import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
    ClassUpdate,
    ClassUpdateDocument,
} from '../../../database/entities/update.entity';
import { Class, ClassDocument } from '../../../database/entities/class.entity';
import {
    Material,
    MaterialDocument,
} from '../../../database/entities/material.entity';
import { CreateClassUpdateRequestDto } from '../dto/create-class-update.dto';

@Injectable()
export class CreateClassUpdateService {
    constructor(
        @InjectModel(ClassUpdate.name)
        private classUpdateModel: Model<ClassUpdateDocument>,
        @InjectModel(Class.name) private classModel: Model<ClassDocument>,
        @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
    ) { }

    async execute(
        classId: string,
        userId: string,
        dto: CreateClassUpdateRequestDto,
    ) {
        const userObjId = new Types.ObjectId(userId);
        const classObjId = new Types.ObjectId(classId);

        // Check Class ID validity and existence
        if (!Types.ObjectId.isValid(classObjId)) {
            throw new NotFoundException('Invalid Class ID format');
        }

        const targetClass = await this.classModel.findById(classObjId).exec();

        if (!targetClass) {
            console.log(`Class with ID ${classId} not found in DB`);
            throw new NotFoundException('Class not found');
        }

        // Check if the user is the instructor or assistant of the class
        const isInstructor =
            targetClass.instructorId.equals(userObjId);

        const isAssistant = targetClass.assistantIds?.some(
            (id) => id.equals(userObjId),
        );
        if (!isInstructor && !isAssistant) {
            throw new ForbiddenException(
                'You do not have permission to post updates',
            );
        }

        // Start transaction for creating update and associated materials
        const session = await this.classModel.db.startSession();
        session.startTransaction();

        try {
            const [newUpdate] = await this.classUpdateModel.create(
                [
                    {
                        classId: targetClass._id,
                        title: dto.title,
                        description: dto.description,
                        category: dto.category,
                        eventAt: dto.eventAt ? new Date(dto.eventAt) : undefined,
                        postedBy: userObjId,
                    },
                ],
                { session },
            );

            if (dto.materials && dto.materials.length > 0) {
                const materialsToCreate = dto.materials.map((m) => ({
                    classId: targetClass._id,
                    updateId: newUpdate._id,
                    url: m.url,
                    name: m.name,
                    type: m.type,
                    size: m.size,
                    uploadedBy: userObjId,
                }));

                const createdMaterials = await this.materialModel.insertMany(
                    materialsToCreate,
                    { session },
                );
                const materialIds = createdMaterials.map((m) => m._id);

                await this.classUpdateModel.updateOne(
                    { _id: newUpdate._id },
                    { $set: { materials: materialIds } }, // Update the ClassUpdate with material references
                    { session },
                );
            }

            const data = await this.classUpdateModel
                .findById(newUpdate._id)
                .populate('postedBy', 'name avatarUrl')
                .populate('materials')
                .exec();

            await session.commitTransaction();

            return {
                success: true,
                message: 'Class update created successfully',
                update: data,
            };
        } catch (error) {
            await session.abortTransaction();
            console.error('Transaction Error:', error);
            throw new InternalServerErrorException('Failed to create class update');
        } finally {
            session.endSession();
        }
    }
}