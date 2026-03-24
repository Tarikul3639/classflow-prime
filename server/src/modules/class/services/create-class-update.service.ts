import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassUpdate, ClassUpdateDocument } from '../../../database/entities/update.entity';
import { Class, ClassDocument } from '../../../database/entities/class.entity';
import { Material, MaterialDocument } from '../../../database/entities/material.entity';
import { CreateClassUpdateRequestDto } from '../dto/create-class-update.dto';

@Injectable()
export class CreateClassUpdateService {
    constructor(
        @InjectModel(ClassUpdate.name) private classUpdateModel: Model<ClassUpdateDocument>,
        @InjectModel(Class.name) private classModel: Model<ClassDocument>,
        @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
    ) { }

    async execute(
        classId: string,
        userId: string,
        dto: CreateClassUpdateRequestDto,
    ) {
        // ১. ক্লাসটি চেক করা (ID ভ্যালিড কি না তা আগে নিশ্চিত হোন)
        if (!Types.ObjectId.isValid(classId)) {
            throw new NotFoundException('Invalid Class ID format');
        }

        const targetClass = await this.classModel.findById(classId);

        if (!targetClass) {
            console.log(`Class with ID ${classId} not found in DB`);
            throw new NotFoundException('Class not found');
        }

        // ২. পারমিশন চেক
        const isInstructor = targetClass.instructorId.toString() === userId.toString();
        const isAssistant = targetClass.assistantIds?.some(id => id.toString() === userId.toString());

        if (!isInstructor && !isAssistant) {
            throw new ForbiddenException('You do not have permission to post updates');
        }

        let eventAt: Date | undefined = undefined;
        if (dto.date) {
            const timeStr = dto.time || '00:00';
            eventAt = new Date(`${dto.date}T${timeStr}:00`);
        }

        // ৩. সেশন শুরু (Connection ইনজেক্ট ছাড়াই)
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
                        eventAt: eventAt,
                        postedBy: new Types.ObjectId(userId),
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
                    uploadedBy: new Types.ObjectId(userId),
                }));

                const createdMaterials = await this.materialModel.insertMany(materialsToCreate, { session });
                const materialIds = createdMaterials.map(m => m._id);

                await this.classUpdateModel.updateOne(
                    { _id: newUpdate._id },
                    { $set: { materials: materialIds } },
                    { session }
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
            console.error("Transaction Error:", error);
            throw new InternalServerErrorException('Failed to create class update');
        } finally {
            session.endSession();
        }
    }
}