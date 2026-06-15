import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import type { IAgent, IAgentMethods, IAgentScopes } from '../interface/agent.interface';
import { AgentStatus } from '../interface/agent.interface';

export type AgentDocument = HydratedDocument<Agent & IAgent & IAgentMethods>;

@Schema({ timestamps: true, strict: true })
export class Agent implements IAgent {
    @Prop({ required: true, trim: true, maxlength: 100 })
    name!: string;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId!: Types.ObjectId;

    @Prop({ required: true, select: false })
    apiKeyHash!: string;

    @Prop({ required: true })
    apiKeyPrefix!: string;

    @Prop({
        type: {
            create: { type: Boolean, default: false },
            update: { type: Boolean, default: false },
            delete: { type: Boolean, default: false },
        },
        default: {
            create: false,
            update: false,
            delete: false,
        },
    })
    scopes!: IAgentScopes;

    @Prop({ type: [Types.ObjectId], ref: 'Class', default: [] })
    allowedClassIds!: Types.ObjectId[];

    @Prop({ required: true, enum: AgentStatus, default: AgentStatus.ACTIVE })
    status!: AgentStatus;

    @Prop()
    expiresAt?: Date;

    @Prop()
    lastUsedAt?: Date;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

// ==================== Indexes ====================

AgentSchema.index({ userId: 1 });
AgentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ==================== Schema Methods ====================

/**
 * Hash and store API key
 */
AgentSchema.methods.setApiKey = async function (rawKey: string) {
    const salt = await bcrypt.genSalt(10);
    this.apiKeyHash = await bcrypt.hash(rawKey, salt);

    const parts = rawKey.split('_');
    this.apiKeyPrefix = parts.length >= 2 
        ? `${parts[0]}_${parts[1]}` 
        : rawKey.slice(0, 8);
};

/**
 * Compare raw API key with stored hash
 */
AgentSchema.methods.compareApiKey = async function (rawKey: string): Promise<boolean> {
    if (!this.apiKeyHash) {
        return false;
    }
    return bcrypt.compare(rawKey, this.apiKeyHash);
};

/**
 * Check expiration
 */
AgentSchema.methods.isExpired = function (): boolean {
    return this.expiresAt ? this.expiresAt <= new Date() : false;
};

/**
 * Revoke agent
 */
AgentSchema.methods.revoke = function () {
    this.status = AgentStatus.REVOKED;
};

/**
 * Update last usage timestamp
 */
AgentSchema.methods.touch = function () {
    this.lastUsedAt = new Date();
};