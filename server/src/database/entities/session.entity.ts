import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ISession } from '../interface/session.interface';

export type SessionDocument = HydratedDocument<Session & ISession>;

@Schema({
    timestamps: true, // createdAt, updatedAt
})
export class Session implements ISession {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User',
    })
    userId: Types.ObjectId; // Reference to the User who owns this session

    @Prop({
        required: true,
    })
    token: string; // Unique session token (e.g., JWT or random hash string)

    @Prop({
        required: true,
    })
    expiresAt: Date; // When the session expires

    @Prop()
    ipAddress?: string; // IP address of the client e.g., "192.168.1.1"

    @Prop()
    userAgent?: string; // User agent string of the client like browser or app info e.g., "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

    //----------------------------------------------------------
    // -------------------- Schema Methods ---------------------
    // ---------------------------------------------------------

    /**
     * Hash the session token before saving
     */
    async setToken(rawToken: string) {
        const salt = await bcrypt.genSalt(10);
        this.token = await bcrypt.hash(rawToken, salt);
    }

    /**
     * Compare raw token with stored hashed token
     */
    async compareToken(rawToken: string): Promise<boolean> {
        if (!this.token) return false;
        return bcrypt.compare(rawToken, this.token);
    }

    /**
     * Check if session is expired
     */
    isExpired(): boolean {
        return this.expiresAt <= new Date();
    }

    /**
     * Invalidate session immediately
     */
    invalidate() {
        this.expiresAt = new Date();
    }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// ==================== Indexes ====================

// TTL index to auto-delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Optional: fast lookup by userId
SessionSchema.index({ userId: 1 });