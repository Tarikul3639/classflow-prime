// update-class-update.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class, ClassDocument } from '../../../database/entities/class.entity';
import {
  ClassUpdate,
  ClassUpdateDocument,
} from '../../../database/entities/update.entity';
import {
  Material,
  MaterialDocument,
} from '../../../database/entities/material.entity';
import { UpdateClassUpdateRequestDto } from '../dto/update-class-update.dto';
import { UpdateClassUpdateResponseDto } from '../dto/update-class-update.dto';

@Injectable()
export class UpdateClassUpdateService {
  constructor(
    @InjectModel(Class.name)
    private readonly classModel: Model<ClassDocument>,

    @InjectModel(ClassUpdate.name)
    private readonly classUpdateModel: Model<ClassUpdateDocument>,

    @InjectModel(Material.name)
    private readonly materialModel: Model<MaterialDocument>,
  ) {}

  async execute(
    userId: string,
    classId: string,
    updateId: string,
    dto: UpdateClassUpdateRequestDto,
  ): Promise<UpdateClassUpdateResponseDto> {
    const userObjectId = new Types.ObjectId(userId);
    const classObjectId = new Types.ObjectId(classId);
    const updateObjectId = new Types.ObjectId(updateId);

    console.log(
      `Updating Update - Class: ${classId}, Update: ${updateId}, User: ${userId}, Body: ${JSON.stringify(dto)}`,
    );

    // Step 1: Class exists কিনা check
    const classData = await this.classModel.findOne({
      _id: classObjectId as any,
      isArchived: false,
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    // Step 2: Permission check
    const isInstructor = classData.instructorId.equals(userObjectId);
    const isAssistant = classData.assistantIds?.some((id) =>
      id.equals(userObjectId),
    );

    if (!isInstructor && !isAssistant) {
      throw new ForbiddenException(
        'Only instructors and assistants can edit updates',
      );
    }

    // Step 3: Update exists কিনা check
    const existingUpdate = await this.classUpdateModel.findOne({
      _id: updateObjectId as any,
      classId: classObjectId,
    });

    if (!existingUpdate) {
      throw new NotFoundException('Update not found');
    }

    // Step 5: Update fields prepare করো
    const updateFields: Record<string, unknown> = {};
    if (dto.title !== undefined) updateFields.title = dto.title;
    if (dto.description !== undefined)
      updateFields.description = dto.description;
    if (dto.category !== undefined) updateFields.category = dto.category;
    if (dto.isPinned !== undefined) updateFields.isPinned = dto.isPinned;
    if (dto.eventAt !== undefined) updateFields.eventAt = dto.eventAt;

    // Step 6: ClassUpdate document update করো
    await this.classUpdateModel.findByIdAndUpdate(updateObjectId, {
      $set: updateFields,
    });

    // Step 7: Materials আসলে পুরনোগুলো replace করো
    if (dto.materials !== undefined) {
      // পুরনো materials delete করো
      await this.materialModel.deleteMany({ updateId: updateObjectId });

      // নতুন materials insert করো
      if (dto.materials.length > 0) {
        const newMaterials = dto.materials.map((m) => ({
          classId: classObjectId,
          updateId: updateObjectId,
          url: m.url,
          name: m.name,
          type: m.type,
          size: m.size,
          uploadedBy: userObjectId,
        }));

        const savedMaterials =
          await this.materialModel.insertMany(newMaterials);

        await this.classUpdateModel.findByIdAndUpdate(updateObjectId, {
          $set: {
            materials: savedMaterials.map((m) => m._id),
          },
        });
      } else {
        // খালি array আসলে materials clear করো
        await this.classUpdateModel.findByIdAndUpdate(updateObjectId, {
          $set: { materials: [] },
        });
      }
    }

    // Step 8: Updated document populate করে return করো
    const updatedDoc = await this.classUpdateModel
      .findById(updateObjectId)
      .populate<{
        postedBy: {
          _id: Types.ObjectId;
          name: string;
          avatarUrl: string | null;
        };
      }>('postedBy', 'name avatarUrl')
      .lean();

    if (!updatedDoc) {
      throw new NotFoundException('Update not found after save');
    }

    const materials = await this.materialModel
      .find({ updateId: updateObjectId })
      .lean();

    return {
      success: true,
      message: 'Update modified successfully',
      data: {
        update: {
          _id: updatedDoc._id.toString(),
          classId: updatedDoc.classId.toString(),
          category: updatedDoc.category,
          title: updatedDoc.title,
          description: updatedDoc.description,
          isPinned: updatedDoc.isPinned,
          postedBy: {
            _id: updatedDoc.postedBy._id.toString(),
            name: updatedDoc.postedBy.name,
            avatarUrl: updatedDoc.postedBy.avatarUrl ?? null,
          },
          eventAt: updatedDoc.eventAt ?? null,
          createdAt: updatedDoc.createdAt || new Date(),
          updatedAt: updatedDoc.updatedAt || new Date(),
          materials: materials.map((m) => ({
            _id: m._id.toString(),
            url: m.url,
            name: m.name ?? 'Untitled File',
            type: m.type,
            size: m.size ?? 0,
          })),
        },
      },
    };
  }
}
