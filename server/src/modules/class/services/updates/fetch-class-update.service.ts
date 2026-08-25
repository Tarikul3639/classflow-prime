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

import { FetchClassUpdateResponseDto } from '../../dto/fetch-class-update.dto';

type CommentUserDoc = {
  _id: Types.ObjectId;
  name: string;
  avatarUrl: string | null;
};

@Injectable()
export class FetchClassUpdateService {
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
    userId: string,
    classId: string,
  ): Promise<FetchClassUpdateResponseDto> {
    // ── Validate User ID ───────────────────────────
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user id');
    }

    // ── Validate Class ID ──────────────────────────
    if (!Types.ObjectId.isValid(classId)) {
      throw new NotFoundException('Invalid class id');
    }

    const currentUserId = userId.toString();
    const classObjectId = new Types.ObjectId(classId);

    // ── Validate Class ─────────────────────────────
    const existingClass = await this.classModel
      .findById(classObjectId)
      .select('_id')
      .lean()
      .exec();

    if (!existingClass) {
      throw new NotFoundException('Class not found');
    }

    // ── Fetch Updates ──────────────────────────────
    const updates = await this.classUpdateModel
      .find({ classId: classObjectId })
      .populate('postedBy', 'name avatarUrl')
      .sort({ isPinned: -1, eventAt: 1, createdAt: -1 })
      .lean()
      .exec();

    const updateIds = updates.map((update) => update._id);

    // ── Fetch Materials ────────────────────────────
    const materials = updateIds.length
      ? await this.materialModel
        .find({
          updateId: { $in: updateIds },
        })
        .lean()
        .exec()
      : [];

    // ── Group Materials by Update ID ───────────────
    const materialMap = new Map<string, any[]>();

    for (const material of materials) {
      const key = material.updateId.toString();

      if (!materialMap.has(key)) {
        materialMap.set(key, []);
      }

      materialMap.get(key)!.push({
        _id: material._id.toString(),
        name: material.name ?? 'Untitled File',
        url: material.url,
        type: material.type,
        size: material.size ?? 0,
      });
    }

    // ── Fetch All Comments for These Updates ───────
    const comments = updateIds.length
      ? await this.classUpdateCommentModel
        .find({
          classId: classObjectId,
          updateId: { $in: updateIds },
        })
        .populate<{
          userId: CommentUserDoc;
        }>('userId', 'name avatarUrl')
        .sort({ createdAt: 1 })
        .lean()
        .exec()
      : [];

    // ── Group Comments by Update ID ────────────────
    const commentMap = new Map<string, any[]>();

    for (const comment of comments) {
      const updateKey = comment.updateId.toString();

      if (!commentMap.has(updateKey)) {
        commentMap.set(updateKey, []);
      }

      const user = comment.userId as unknown as CommentUserDoc;

      commentMap.get(updateKey)!.push({
        _id: comment._id.toString(),
        name: user?.name ?? 'Unknown User',
        avatarUrl: user?.avatarUrl ?? undefined,
        message: comment.message,

        // ── Check Comment Ownership ────────────────
        isOwner: user?._id?.toString() === currentUserId,

        createdAt: comment.createdAt.toISOString(),
      });
    }

    // ── Response ───────────────────────────────────
    return {
      success: true,
      message: 'Class updates fetched successfully',
      data: {
        update: updates.map((update: any) => {
          const updateId = update._id.toString();

          const updateComments = commentMap.get(updateId) ?? [];

          return {
            _id: updateId,
            classId: update.classId.toString(),
            title: update.title,
            description: update.description ?? null,
            category: update.category,
            isPinned: update.isPinned,

            eventAt: update.eventAt
              ? update.eventAt.toISOString()
              : null,

            createdAt: update.createdAt.toISOString(),

            updatedAt: update.updatedAt.toISOString(),

            postedBy: {
              _id: update.postedBy?._id?.toString() ?? '',
              name: update.postedBy?.name ?? 'Unknown User',
              avatarUrl: update.postedBy?.avatarUrl ?? null,
            },

            materials: materialMap.get(updateId) ?? [],

            // ── Comments ──────────────────────────
            comments: updateComments,

            // ── Engagement ────────────────────────
            engagement: {
              avatars: [],
              commentCount: updateComments.length,
            },
          };
        }),
      },
    };
  }
}