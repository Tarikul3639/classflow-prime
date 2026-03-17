import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IClass, ClassStatus } from '../interface/class.interface';

export type ClassDocument = HydratedDocument<Class & IClass>;

@Schema({
    timestamps: true,
    strict: true,
})
export class Class implements IClass {
    @Prop({
        required: true,
        trim: true,
    })
    name: string;

    @Prop({ required: true, unique: true })
    joinCode: string; // Teacher generated code

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    instructorId: Types.ObjectId;

    @Prop({
        type: [Types.ObjectId],
        ref: 'User',
        default: [],
    })
    assistantIds?: Types.ObjectId[];

    @Prop({
        trim: true,
        maxlength: 1000,
    })
    description?: string;

    @Prop({
        trim: true,
        maxlength: 20,
    })
    semester?: string; // e.g., "Fall 2024"

    @Prop({
        type: [String],
        default: [],
    })
    tags: string[];

    @Prop({
        enum: Object.values(ClassStatus),
        default: ClassStatus.ACTIVE,
        index: true,
    })
    status: ClassStatus;

    @Prop({ default: false })
    isArchived: boolean;
}

export const ClassSchema = SchemaFactory.createForClass(Class);

// ==================== Indexes ====================
ClassSchema.index({ name: 'text', description: 'text', tags: 'text' }); // for text search