import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IVerification } from '../interface/verification.interface';

export type VerificationDocument = HydratedDocument<Verification & IVerification>;

@Schema({
    timestamps: true, // createdAt, updatedAt
    strict: true, // only defined fields are allowed
})
export class Verification implements IVerification {
    @Prop({
        required: true,
        trim: true,
    })
    identifier: string; // e.g., email or phone number

    @Prop({
        required: true,
    })
    value: string; // e.g., OTP code or verification token

    @Prop({
        required: true,
    })
    expiresAt: Date;

    // ==================== Schema Methods ====================

    /**
     * Check if the token is expired
     */
    isExpired(): boolean {
        return this.expiresAt <= new Date();
    }

    /**
     * Verify token value
     */
    verify(token: string): boolean {
        return !this.isExpired() && this.value === token;
    }
}

export const VerificationSchema =
    SchemaFactory.createForClass(Verification);

// ==================== Indexes ====================

// TTL index to automatically delete expired tokens
VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Optional: fast lookup by identifier
VerificationSchema.index({ identifier: 1 });