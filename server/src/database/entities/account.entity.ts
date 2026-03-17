import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IAccount, AccountProvider } from '../interface/account.interface';

export type AccountDocument = HydratedDocument<Account & IAccount>;

@Schema({
    timestamps: true,
})
export class Account implements IAccount {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'User',
    })
    userId: Types.ObjectId;

    @Prop({
        required: true,
        trim: true,
    })
    accountId: string;  // unique ID given by the provider to identify the user (e.g., Google/GitHub ID)

    @Prop({
        required: true,
        enum: AccountProvider,
        trim: true,
    })
    providerId: AccountProvider; // e.g., 'google', 'github', 'password'

    @Prop({
        select: false,
    })
    password?: string;

    @Prop()
    accessToken?: string;

    @Prop()
    refreshToken?: string;

    @Prop()
    accessTokenExpiresAt?: Date;

    @Prop()
    refreshTokenExpiresAt?: Date;

    @Prop()
    scope?: string;

    @Prop()
    idToken?: string; // For OpenID Connect providers, the raw ID token (JWT) returned by the provider (optional)

    // ==================== Schema Methods ====================

    async setPassword(rawPassword: string) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(rawPassword, salt);
    }

    async comparePassword(rawPassword: string): Promise<boolean> {
        if (!this.password) return false;
        return bcrypt.compare(rawPassword, this.password);
    }

    async setAccessToken(token: string) {
        const salt = await bcrypt.genSalt(10);
        this.accessToken = await bcrypt.hash(token, salt);
    }

    async compareAccessToken(token: string): Promise<boolean> {
        if (!this.accessToken) return false;
        return bcrypt.compare(token, this.accessToken);
    }

    async setRefreshToken(token: string) {
        const salt = await bcrypt.genSalt(10);
        this.refreshToken = await bcrypt.hash(token, salt);
    }

    async compareRefreshToken(token: string): Promise<boolean> {
        if (!this.refreshToken) return false;
        return bcrypt.compare(token, this.refreshToken);
    }

    isAccessTokenExpired(): boolean {
        return !this.accessTokenExpiresAt || this.accessTokenExpiresAt <= new Date();
    }

    isRefreshTokenExpired(): boolean {
        return !this.refreshTokenExpiresAt || this.refreshTokenExpiresAt <= new Date();
    }
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// ==================== Indexes ====================
AccountSchema.index({ providerId: 1, accountId: 1 }, { unique: true });
AccountSchema.index({ userId: 1 });