import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    CreateClassUpdateCommentRequestDto,
    CreateClassUpdateCommentResponseDto,
} from '../../dto/create-class-update-comment.dto';

import {
    ClassUpdate,
    ClassUpdateDocument,
} from '../../../../infrastructure/database/entities/update.entity';

import {
    ClassUpdateComment,
    ClassUpdateCommentDocument,
} from '../../../../infrastructure/database/entities/class-update-comment.entity';

import {
    User,
    UserDocument,
} from '../../../../infrastructure/database/entities/user.entity';

@Injectable()
export class CreateClassUpdateCommentService {
    constructor(
        @InjectModel(ClassUpdate.name)
        private readonly classUpdateModel: Model<ClassUpdateDocument>,

        @InjectModel(ClassUpdateComment.name)
        private readonly classUpdateCommentModel: Model<ClassUpdateCommentDocument>,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async execute(
        userId: string,
        classId: string,
        updateId: string,
        body: CreateClassUpdateCommentRequestDto,
    ): Promise<CreateClassUpdateCommentResponseDto> {
 
        // ── Validate IDs ────────────────────────────────────────────────
        if (!Types.ObjectId.isValid(classId)) {
            throw new NotFoundException('Invalid class id');
        }

        if (!Types.ObjectId.isValid(updateId)) {
            throw new NotFoundException('Invalid update id');
        }

        if (!Types.ObjectId.isValid(userId)) {
            throw new NotFoundException('Invalid user id');
        }

        const classObjectId = new Types.ObjectId(classId);
        const updateObjectId = new Types.ObjectId(updateId);
        const userObjectId = new Types.ObjectId(userId);

        // ── Check Class Update ──────────────────────────────────────────
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

        // ── Check User ──────────────────────────────────────────────────
        const user = await this.userModel
            .findById(userObjectId)
            .select('name avatarUrl')
            .lean()
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // ── Create Comment ──────────────────────────────────────────────
        const comment = await this.classUpdateCommentModel.create({
            classId: classObjectId,
            updateId: updateObjectId,
            userId: userObjectId,
            message: body.message.trim(),
        });

        // ── Return Frontend Response ────────────────────────────────────
        return {
            success: true,
            message: 'Comment created successfully',
            data: {
                comment: {
                    _id: comment._id.toString(),
                    name: user.name,
                    avatarUrl: user.avatarUrl ?? undefined,
                    isOwner: true,
                    message: comment.message,
                    createdAt: comment.createdAt,
                },
            },
        };
    }
}