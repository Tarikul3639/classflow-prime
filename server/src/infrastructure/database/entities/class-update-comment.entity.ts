import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ClassUpdateCommentDocument = HydratedDocument<ClassUpdateComment>;

@Schema({
    timestamps: true,
    strict: true,
})
export class ClassUpdateComment {
    // Which class update this comment belongs to
    @Prop({
        type: Types.ObjectId,
        ref: 'ClassUpdate',
        required: true,
        index: true,
    })
    updateId!: Types.ObjectId;

    // Which class this comment belongs to
    @Prop({
        type: Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true,
    })
    classId!: Types.ObjectId;

    // Who created the comment
    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    })
    userId!: Types.ObjectId;

    // Comment content
    @Prop({
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000,
    })
    message!: string;

    // Timestamps are automatically handled by timestamps: true
    createdAt!: Date;
    updatedAt!: Date;
}

export const ClassUpdateCommentSchema =
    SchemaFactory.createForClass(ClassUpdateComment);

// ==================== Indexes ====================

// Fetch comments for an update efficiently
ClassUpdateCommentSchema.index({
    updateId: 1,
    createdAt: -1,
});

// Optional: useful for ownership/history queries
ClassUpdateCommentSchema.index({
    userId: 1,
    createdAt: -1,
});
