import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

import {
    ActivityAction,
    ActivitySeverity,
    ActivityStatus,
    IActivityLog,
} from '../interface/activity-log.interface';

export type ActivityLogDocument = HydratedDocument<
    ActivityLog & IActivityLog
>

@Schema({
    timestamps: true, // createdAt & updatedAt
    strict: true, // only defined fields are allowed
})
export class ActivityLog implements IActivityLog {
    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        index: true,
    })
    userId?: Types.ObjectId;

    @Prop({
        required: true,
        enum: ActivityAction,
        index: true
    })
    action!: ActivityAction

    @Prop({
        required: true,
        enum: ActivitySeverity,
        index: true
    })
    severity!: ActivitySeverity

    @Prop({
        required: true,
        enum: ActivityStatus,
        index: true,
    })
    status!: ActivityStatus;

    // Resource
    @Prop({
        trim: true
    })
    resource?: string;

    @Prop({
        trim: true
    })
    resourceId?: string;

    @Prop({
        trim: true,
        required: true
    })
    ipAddress!: string;

    @Prop({
        index: true
    })
    userAgent?: string;

    @Prop({
        trim: true,
    })
    method?: string;

    @Prop({
        trim: true,
    })
    endpoint?: string;

    @Prop({
        type: Object,
        default: {}
    })
    metadata!: Record<string, unknown>;

    @Prop({
        trim: true,
        maxlength: 500,
    })
    description?: string;

    createdAt!: Date;
    updatedAt!: Date;

}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog)