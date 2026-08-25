import { Injectable, NotFoundException } from '@nestjs/common';
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
  ClassUpdateComment,
  ClassUpdateCommentDocument,
} from '../../../../infrastructure/database/entities/class-update-comment.entity';

import { FetchSingleClassUpdateResponseDto } from '../../dto/fetch-single-class-update.dto';

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

@Injectable()
export class FetchSingleClassUpdateService {
  constructor(
    @InjectModel(Class.name)
    private readonly classModel: Model<ClassDocument>,

    @InjectModel(ClassUpdate.name)
    private readonly classUpdateModel: Model<ClassUpdateDocument>,

    @InjectModel(Material.name)
    private readonly materialModel: Model<MaterialDocument>,

    @InjectModel(ClassUpdateComment.name)
    private readonly classUpdateCommentModel: Model<ClassUpdateCommentDocument>,
  ) { }

  async execute(
    classId: string,
    updateId: string,
  ): Promise<FetchSingleClassUpdateResponseDto> {
    // ── Validate IDs ─────────────────────────────────────────────

    if (!Types.ObjectId.isValid(classId)) {
      throw new NotFoundException('Invalid class id');
    }

    if (!Types.ObjectId.isValid(updateId)) {
      throw new NotFoundException('Invalid update id');
    }

    const classObjectId = new Types.ObjectId(classId);
    const updateObjectId = new Types.ObjectId(updateId);

    // ── Validate Class Existence ─────────────────────────────────

    const existingClass = await this.classModel
      .findById(classObjectId)
      .select('_id')
      .lean()
      .exec();

    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }

    // ── Fetch Update Details ─────────────────────────────────────

    const update = await this.classUpdateModel
      .findOne({
        _id: updateObjectId,
        classId: classObjectId,
      })
      .populate<{
        postedBy: PostedByDoc;
      }>('postedBy', 'name avatarUrl')
      .lean()
      .exec();

    if (!update) {
      throw new NotFoundException('The update was not found.');
    }

    // ── Fetch Materials ──────────────────────────────────────────

    const materials = await this.materialModel
      .find({
        updateId: updateObjectId,
      })
      .lean()
      .exec();

    // ── Fetch Comments ───────────────────────────────────────────

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

    console.log('COMMENTS:', comments);

    // ── Response ─────────────────────────────────────────────────

    const postedBy = update.postedBy;

    return {
      success: true,

      message: 'Class update details fetched successfully',

      data: {
        update: {
          _id: update._id.toString(),

          classId: update.classId.toString(),

          title: update.title,

          description: update.description ?? null,

          category: update.category,

          isPinned: update.isPinned,

          eventAt: update.eventAt ? update.eventAt.toISOString() : null,

          createdAt: update.createdAt.toISOString(),

          updatedAt: update.updatedAt.toISOString(),

          // ── Posted By ────────────────────────────────────────

          postedBy: {
            _id: postedBy?._id?.toString() ?? '',
            name: postedBy?.name ?? 'Unknown User',
            avatarUrl: postedBy?.avatarUrl ?? null,
          },

          // ── Materials ────────────────────────────────────────

          materials: materials.map((material) => ({
            _id: material._id.toString(),
            name: material.name ?? 'Untitled File',
            url: material.url,
            type: material.type,
            size: material.size ?? 0,
          })),

          // ── Comments ─────────────────────────────────────────

          comments: comments.map((comment) => ({
            _id: comment._id.toString(),

            name: comment.userId?.name ?? 'Unknown User',

            avatarUrl: comment.userId?.avatarUrl ?? undefined,

            message: comment.message,

            // NOTE:
            // বর্তমানে logged-in user নেই, তাই এখানে true/false
            // properly calculate করা যাচ্ছে না।
            // currentUserId pass করলে এটা correct করা যাবে।
            isOwner: false,

            createdAt: comment.createdAt.toISOString(),
          })),

          // ── Engagement ───────────────────────────────────────

          engagement: {
            avatars: [],
            commentCount: comments.length,
          },
        },
      },
    };
  }
}
