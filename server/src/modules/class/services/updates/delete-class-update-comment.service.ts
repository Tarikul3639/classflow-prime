import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    ClassUpdate,
    ClassUpdateDocument,
} from '../../../../infrastructure/database/entities/update.entity';

import {
    ClassUpdateComment,
    ClassUpdateCommentDocument,
} from '../../../../infrastructure/database/entities/class-update-comment.entity';

@Injectable()
export class DeleteClassUpdateCommentService {
    constructor(
        @InjectModel(ClassUpdate.name)
        private readonly classUpdateModel: Model<ClassUpdateDocument>,

        @InjectModel(ClassUpdateComment.name)
        private readonly classUpdateCommentModel: Model<ClassUpdateCommentDocument>,
    ) { }

    async execute(
        userId: string,
        classId: string,
        updateId: string,
        commentId: string,
    ) {
        // ── Validate IDs ──────────────────────────────────────────────
        if (!Types.ObjectId.isValid(classId)) {
            throw new NotFoundException('Invalid class id');
        }

        if (!Types.ObjectId.isValid(updateId)) {
            throw new NotFoundException('Invalid update id');
        }

        if (!Types.ObjectId.isValid(commentId)) {
            throw new NotFoundException('Invalid comment id');
        }

        if (!Types.ObjectId.isValid(userId)) {
            throw new NotFoundException('Invalid user id');
        }

        const classObjectId = new Types.ObjectId(classId);
        const updateObjectId = new Types.ObjectId(updateId);
        const commentObjectId = new Types.ObjectId(commentId);

        // ── Check if update exists ────────────────────────────────────
        const update = await this.classUpdateModel
            .findOne({
                _id: updateObjectId,
                classId: classObjectId,
            })
            .select('_id')
            .lean()
            .exec();

        if (!update) {
            throw new NotFoundException('Class update not found');
        }

        // ── Find comment ──────────────────────────────────────────────
        const comment = await this.classUpdateCommentModel
            .findOne({
                _id: commentObjectId,
                updateId: updateObjectId,
                classId: classObjectId,
            })
            .select('userId')
            .lean()
            .exec();

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        // ── Ownership check ───────────────────────────────────────────
        if (comment.userId.toString() !== userId) {
            throw new ForbiddenException(
                'You are not allowed to delete this comment',
            );
        }

        // ── Delete comment ────────────────────────────────────────────
        await this.classUpdateCommentModel.deleteOne({
            _id: commentObjectId,
        });

        return {
            success: true,
            message: 'Comment deleted successfully',
            data: {
                commentId,
            },
        };
    }
}