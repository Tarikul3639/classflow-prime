// update-class-update.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

// Entities
import { Class, ClassDocument } from '../../../../infrastructure/database/entities/class.entity';
import { ClassUpdate, ClassUpdateDocument } from '../../../../infrastructure/database/entities/update.entity';
import { Material, MaterialDocument } from '../../../../infrastructure/database/entities/material.entity';
import { Enrollment, EnrollmentDocument } from '../../../../infrastructure/database/entities/enrollment.entity';
import { NotificationType } from '../../../../infrastructure/database/entities/notification.entity';

// Interfaces
import { ClassStatus } from '../../../../infrastructure/database/interface/class.interface';
import { UpdateCategory } from '../../../../infrastructure/database/interface/update.interface';

// DTOs & Services
import {
  UpdateClassUpdateRequestDto,
  UpdateClassUpdateResponseDto,
} from '../../dto/update-class-update.dto';
import { NotificationService } from '../../../notification/services/notification.service';
import { trackChange } from '../../../../utils/change-tracker.util';

@Injectable()
export class UpdateClassUpdateService {
  constructor(
    @InjectModel(Class.name)
    private readonly classModel: Model<ClassDocument>,

    @InjectModel(ClassUpdate.name)
    private readonly classUpdateModel: Model<ClassUpdateDocument>,

    @InjectModel(Material.name)
    private readonly materialModel: Model<MaterialDocument>,

    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,

    private readonly notificationService: NotificationService,
  ) {}

  async execute(
    classId: string,
    updateId: string,
    dto: UpdateClassUpdateRequestDto,
  ): Promise<UpdateClassUpdateResponseDto> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new NotFoundException('Invalid class id');
    }

    if (!Types.ObjectId.isValid(updateId)) {
      throw new NotFoundException('Invalid update id');
    }

    const classObjectId = new Types.ObjectId(classId);
    const updateObjectId = new Types.ObjectId(updateId);

    const classData = await this.classModel
      .findById(classObjectId)
      .select('className status')
      .lean<{ className: string; status: ClassStatus }>()
      .exec();

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    if (classData.status === ClassStatus.ENDED) {
      throw new ForbiddenException('Cannot modify updates of an ended class');
    }

    const existingUpdate = await this.classUpdateModel
      .findOne({
        _id: updateObjectId,
        classId: classObjectId,
      })
      .select('title description category eventAt postedBy')
      .lean<{
        title: string;
        description: string;
        category: UpdateCategory;
        eventAt?: Date | null;
        postedBy: Types.ObjectId;
      }>()
      .exec();

    if (!existingUpdate) {
      throw new NotFoundException('Update not found');
    }

    const changes: string[] = [];

    const titleChange = trackChange('Title', existingUpdate.title, dto.title);
    if (titleChange) changes.push(titleChange);

    const descriptionChange = trackChange(
      'Description',
      existingUpdate.description,
      dto.description,
    );
    if (descriptionChange) changes.push(descriptionChange);

    const categoryChange = trackChange(
      'Category',
      existingUpdate.category,
      dto.category,
    );
    if (categoryChange) changes.push(categoryChange);

    const oldEventAt = existingUpdate.eventAt ?? null;
    const newEventAt = dto.eventAt ? new Date(dto.eventAt) : null;
    const eventAtChange = trackChange('Event date', oldEventAt, newEventAt);
    if (eventAtChange) changes.push(eventAtChange);

    if (dto.materials !== undefined) {
      if (dto.materials.length === 0) {
        changes.push('• Materials cleared');
      } else {
        changes.push('• Materials updated');
      }
    }

    const updateFields: Record<string, unknown> = {};

    if (dto.title !== undefined) updateFields.title = dto.title;
    if (dto.description !== undefined) updateFields.description = dto.description;
    if (dto.category !== undefined) updateFields.category = dto.category;
    if (dto.isPinned !== undefined) updateFields.isPinned = dto.isPinned;
    if (dto.eventAt !== undefined) {
      updateFields.eventAt = dto.eventAt ? new Date(dto.eventAt) : undefined;
    }

    const session = await this.classModel.db.startSession();
    session.startTransaction();

    try {
      await this.classUpdateModel.findByIdAndUpdate(
        updateObjectId,
        { $set: updateFields },
        { session },
      );

      if (dto.materials !== undefined) {
        await this.materialModel.deleteMany(
          { updateId: updateObjectId },
          { session },
        );

        if (dto.materials.length > 0) {
          const newMaterials = dto.materials.map((m) => ({
            classId: classObjectId,
            updateId: updateObjectId,
            url: m.url,
            name: m.name,
            type: m.type,
            size: m.size,
            uploadedBy: existingUpdate.postedBy,
          }));

          const savedMaterials = await this.materialModel.insertMany(newMaterials, {
            session,
          });

          await this.classUpdateModel.findByIdAndUpdate(
            updateObjectId,
            {
              $set: {
                materials: savedMaterials.map((m) => m._id),
              },
            },
            { session },
          );
        } else {
          await this.classUpdateModel.findByIdAndUpdate(
            updateObjectId,
            { $set: { materials: [] } },
            { session },
          );
        }
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException('Failed to modify class update');
    } finally {
      session.endSession();
    }

    const updatedDoc = await this.classUpdateModel
      .findById(updateObjectId)
      .populate<{
        postedBy: {
          _id: Types.ObjectId;
          name: string;
          avatarUrl: string | null;
        };
      }>('postedBy', 'name avatarUrl')
      .lean()
      .exec();

    if (!updatedDoc) {
      throw new NotFoundException('Update not found after save');
    }

    const materials = await this.materialModel
      .find({ updateId: updateObjectId })
      .lean()
      .exec();

    const enrollments = await this.enrollmentModel
      .find({ classId: classObjectId })
      .select('userId')
      .lean<{ userId: Types.ObjectId }[]>()
      .exec();

    const recipientIds = [
      ...new Set(enrollments.map((e) => e.userId.toString())),
    ].filter((id) => id !== updatedDoc.postedBy._id.toString());

    const message =
      changes.length > 0
        ? changes.join('\n')
        : 'An update has been modified.';

    if (recipientIds.length > 0) {
      await this.notificationService.createBulk({
        recipientIds,
        senderId: updatedDoc.postedBy._id.toString(),
        title: classData.className,
        message,
        type: NotificationType.UPDATE,
        metadata: {
          classId,
          updateId: updateObjectId.toString(),
        },
      });
    }

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
          eventAt: updatedDoc.eventAt ? updatedDoc.eventAt.toISOString() : null,
          createdAt: updatedDoc.createdAt.toISOString(),
          updatedAt: updatedDoc.updatedAt.toISOString(),
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