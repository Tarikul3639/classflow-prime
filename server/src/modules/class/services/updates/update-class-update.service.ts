// server/src/modules/class/services/updates/update-class-update.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Class,
  ClassDocument,
} from '../../../../infrastructure/database/entities/class.entity';

import {
  ClassUpdate,
  ClassUpdateDocument,
} from '../../../../infrastructure/database/entities/update.entity';

import {
  Material,
  MaterialDocument,
} from '../../../../infrastructure/database/entities/material.entity';

import {
  Enrollment,
  EnrollmentDocument,
} from '../../../../infrastructure/database/entities/enrollment.entity';

import {
  ClassUpdateComment,
  ClassUpdateCommentDocument,
} from '../../../../infrastructure/database/entities/class-update-comment.entity';

import { NotificationType } from '../../../../infrastructure/database/entities/notification.entity';

import { ClassStatus } from '../../../../infrastructure/database/interface/class.interface';

import {
  UpdateClassUpdateRequestDto,
  UpdateClassUpdateResponseDto,
} from '../../dto/update-class-update.dto';

import { NotificationService } from '../../../notification/services/notification.service';

import {
  buildChangeTrackedUpdate,
  trackDerivedChange,
} from '../../../../utils/change-tracker.util';

type PostedByDoc = {
  _id: Types.ObjectId;
  name: string;
  avatarUrl: string | null;
};

type CommentUserDoc = {
  _id: Types.ObjectId;
  name: string;
  avatarUrl: string | null;
};

type ExistingUpdateDoc = {
  title: string;
  description: string;
  category: string;
  eventAt?: Date | null;
  postedBy: Types.ObjectId;
  isPinned: boolean;
};

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

    @InjectModel(ClassUpdateComment.name)
    private readonly classUpdateCommentModel: Model<ClassUpdateCommentDocument>,

    private readonly notificationService: NotificationService,
  ) { }

  async execute(
    classId: string,
    updateId: string,
    dto: UpdateClassUpdateRequestDto,
  ): Promise<UpdateClassUpdateResponseDto> {
    // ── Validate IDs ─────────────────────────────────────────────

    if (!Types.ObjectId.isValid(classId)) {
      throw new NotFoundException('Invalid class id');
    }

    if (!Types.ObjectId.isValid(updateId)) {
      throw new NotFoundException('Invalid update id');
    }

    const classObjectId = new Types.ObjectId(classId);
    const updateObjectId = new Types.ObjectId(updateId);

    // ── Find Class ───────────────────────────────────────────────

    const classData = await this.classModel
      .findById(classObjectId)
      .select('className status')
      .lean<{
        className: string;
        status: ClassStatus;
      }>()
      .exec();

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    if (classData.status === ClassStatus.ENDED) {
      throw new ForbiddenException('Cannot modify updates of an ended class');
    }

    // ── Find Existing Update ─────────────────────────────────────

    const existingUpdate = await this.classUpdateModel
      .findOne({
        _id: updateObjectId,
        classId: classObjectId,
      })
      .select('title description category eventAt postedBy isPinned')
      .lean<ExistingUpdateDoc>()
      .exec();

    if (!existingUpdate) {
      throw new NotFoundException('Update not found');
    }

    // ── Build Update Fields + Change Logs ────────────────────────

    const { updateFields, changes } = buildChangeTrackedUpdate(
      existingUpdate,
      dto,
      {
        title: {
          label: 'Title',
        },

        description: {
          label: 'Description',
        },

        category: {
          label: 'Category',
        },

        eventAt: {
          label: 'Event date',

          transform: (value) => (value ? new Date(value) : null),

          formatter: (value) =>
            value instanceof Date
              ? value.toLocaleString()
              : value
                ? String(value)
                : 'Empty',
        },
      },
    );

    // ── Pin ─────────────────────────────────────────────────────

    if (dto.isPinned !== undefined) {
      updateFields.isPinned = dto.isPinned;
    }

    // ── Materials Change Tracking ────────────────────────────────

    if (dto.materials !== undefined) {
      const previousMaterialsCount = await this.materialModel.countDocuments({
        updateId: updateObjectId,
      });

      const materialsChange = trackDerivedChange(
        'Materials',
        previousMaterialsCount,
        dto.materials.length,
        (value) => `${value} file${Number(value) === 1 ? '' : 's'}`,
      );

      if (materialsChange) {
        changes.push(materialsChange);
      }
    }

    // ── Transaction ──────────────────────────────────────────────

    const session = await this.classModel.db.startSession();

    session.startTransaction();

    try {
      // Update basic fields
      await this.classUpdateModel.findByIdAndUpdate(
        updateObjectId,
        {
          $set: updateFields,
        },
        {
          session,
        },
      );

      // Update materials
      if (dto.materials !== undefined) {
        await this.materialModel.deleteMany(
          {
            updateId: updateObjectId,
          },
          {
            session,
          },
        );

        const materialIds = dto.materials.length
          ? (
            await this.materialModel.insertMany(
              dto.materials.map((material) => ({
                classId: classObjectId,
                updateId: updateObjectId,

                url: material.url,
                name: material.name,
                type: material.type,
                size: material.size,

                uploadedBy: existingUpdate.postedBy,
              })),
              {
                session,
              },
            )
          ).map((material) => material._id)
          : [];

        await this.classUpdateModel.findByIdAndUpdate(
          updateObjectId,
          {
            $set: {
              materials: materialIds,
            },
          },
          {
            session,
          },
        );
      }

      await session.commitTransaction();
    } catch {
      await session.abortTransaction();

      throw new InternalServerErrorException('Failed to modify class update');
    } finally {
      session.endSession();
    }

    // ── Fetch Updated Update ─────────────────────────────────────

    const updatedDoc = await this.classUpdateModel
      .findById(updateObjectId)
      .populate<{
        postedBy: PostedByDoc;
      }>('postedBy', 'name avatarUrl')
      .lean()
      .exec();

    if (!updatedDoc) {
      throw new NotFoundException('Update not found after save');
    }

    // ── Fetch Materials ──────────────────────────────────────────

    const materials = await this.materialModel
      .find({
        updateId: updateObjectId,
      })
      .lean()
      .exec();

    // ── Fetch Comments ───────────────────────────────────────────
    // Comments are stored in a separate collection

    const comments = await this.classUpdateCommentModel
      .find({
        classId: classObjectId,
        updateId: updateObjectId,
      })
      .populate<{
        userId: CommentUserDoc;
      }>('userId', 'name avatarUrl')
      .sort({
        createdAt: 1,
      })
      .lean()
      .exec();

    // ── Fetch Recipients ─────────────────────────────────────────

    const enrollments = await this.enrollmentModel
      .find({
        classId: classObjectId,
      })
      .select('userId')
      .lean<
        {
          userId: Types.ObjectId;
        }[]
      >()
      .exec();

    const recipientIds = [
      ...new Set(enrollments.map((enrollment) => enrollment.userId.toString())),
    ].filter((id) => id !== updatedDoc.postedBy._id.toString());

    // ── Notification ─────────────────────────────────────────────

    if (recipientIds.length > 0) {
      await this.notificationService.createBulk({
        recipientIds,

        senderId: updatedDoc.postedBy._id.toString(),

        title: classData.className,

        message:
          changes.length > 0
            ? changes.join('\n')
            : 'An update has been modified.',

        type: NotificationType.UPDATE,

        metadata: {
          classId,
          updateId: updateObjectId.toString(),
        },
      });
    }

    // ── Return Response ──────────────────────────────────────────

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

          // Posted By
          postedBy: {
            _id: updatedDoc.postedBy._id.toString(),

            name: updatedDoc.postedBy.name,

            avatarUrl: updatedDoc.postedBy.avatarUrl ?? null,
          },

          // Event
          eventAt: updatedDoc.eventAt ? updatedDoc.eventAt.toISOString() : null,

          // Dates
          createdAt:
            updatedDoc.createdAt?.toISOString?.() ?? new Date().toISOString(),

          updatedAt:
            updatedDoc.updatedAt?.toISOString?.() ?? new Date().toISOString(),

          // Materials
          materials: materials.map((material) => ({
            _id: material._id.toString(),

            url: material.url,

            name: material.name ?? 'Untitled File',

            type: material.type,

            size: material.size ?? 0,
          })),

          // Comments
          comments: comments.map((comment) => ({
            _id: comment._id.toString(),

            name: comment.userId?.name ?? 'Unknown User',

            avatarUrl: comment.userId?.avatarUrl ?? undefined,

            message: comment.message,

            // This means ownership from the update author's perspective.
            // For the currently logged-in user, ownership should ideally
            // be calculated in the fetch service using currentUserId.
            isOwner:
              comment.userId?._id.toString() ===
              updatedDoc.postedBy._id.toString(),

            createdAt: comment.createdAt.toISOString(),
          })),
        },
      },
    };
  }
}
