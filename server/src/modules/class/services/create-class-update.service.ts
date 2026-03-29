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

import { NotificationService } from '../../notification/services/notification.service';
import { NotificationType } from '../../../database/entities/notification.entity';

import {
  Enrollment,
  EnrollmentDocument,
} from '../../../database/entities/enrollment.entity';
import { EnrollmentRole } from '../../../database/interface/enrollment.interface';

@Injectable()
export class CreateClassUpdateService {
  constructor(
    @InjectModel(ClassUpdate.name)
    private classUpdateModel: Model<ClassUpdateDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
    private notificationService: NotificationService,
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
    const isInstructor = targetClass.instructorId.equals(userObjId);

    const isAssistant = targetClass.assistantIds?.some((id) =>
      id.equals(userObjId),
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

      /**   
       * After successfully creating the class update and associated materials,
       * we need to notify all relevant users (learners, assistants, instructor).
       * This is done after the transaction commits to ensure we only notify if the update was created successfully.
       */

      // ── 1. Get all enrolled learners ───────────────────────
      const enrollments = await this.enrollmentModel
        .find({ classId: classObjId, role: EnrollmentRole.LEARNER })
        .select('userId')
        .lean();

      const learnerIds = enrollments.map((e) => e.userId.toString());

      // ── 2. Get assistants from class document ──────────────
      const assistantIds = (targetClass.assistantIds ?? []).map((id) =>
        id.toString(),
      );

      // ── 3. Include the instructor ──────────────────────────
      const instructorId = targetClass.instructorId.toString();

      // ── 4. Merge all, exclude the poster ──────────────────
      const allRecipients = [
        ...new Set([...learnerIds, ...assistantIds, instructorId]),
      ].filter((id) => id !== userId); // remove whoever posted

      // ── 5. Fire notification ───────────────────────────────
      if (allRecipients.length > 0) {
        await this.notificationService.createBulk({
          recipientIds: allRecipients,
          senderId: userObjId as any,
          title: targetClass.name,
          message: `A new update has been posted please check the latest update in the class.`,
          type: NotificationType.UPDATE,
          metadata: {
            classId,
            updateId: data?._id.toString(),
          },
        });
      }

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
