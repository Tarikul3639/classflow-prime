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
  className!: string;

  @Prop({
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 6,
  })
  enrollCode!: string; // Teacher generated code

  @Prop({
    trim: true,
    maxlength: 100,
  })
  department?: string; // e.g., "Computer Science"

  @Prop({
    trim: true,
    maxlength: 50,
  })
  semester?: string; // e.g., "Fall 2024"

  // UI Identity Fields
  @Prop({ default: '#3B82F6' }) // Default blue
  themeColor!: string;

  @Prop({
    type: String,
    default: null,
  })
  coverImage?: string | null;

  @Prop({
    enum: Object.values(ClassStatus),
    default: ClassStatus.ACTIVE,
    index: true,
  })
  status!: ClassStatus;

  @Prop({ default: true })
  allowEnroll!: boolean;

  @Prop({
    default: false,
    index: true,
  })
  isBlocked!: boolean;

  @Prop({
    type: String,
    default: null,
    trim: true,
    maxlength: 500,
  })
  blockedReason?: string | null;

  @Prop({
    type: Date,
    default: null,
  })
  blockedAt?: Date | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  blockedBy?: Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  createdBy!: Types.ObjectId;
}

export const ClassSchema = SchemaFactory.createForClass(Class);

// ==================== Indexes ====================
ClassSchema.index({ className: 'text' }); // for text search