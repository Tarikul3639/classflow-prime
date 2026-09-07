import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    User,
    UserDocument,
} from '../../../infrastructure/database/entities/user.entity';

import {
    Verification,
    VerificationDocument,
} from '../../../infrastructure/database/entities/verification.entity';

import { MailService } from '../../../infrastructure/mail/mail.service';

import { ConfigService } from '@nestjs/config';

import ms, { StringValue } from 'ms';

@Injectable()
export class SendAdminPasswordResetEmailService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(Verification.name)
        private readonly verificationModel: Model<VerificationDocument>,

        private readonly mailService: MailService,

        private readonly configService: ConfigService,
    ) { }

    private get otpExpiryMinutes(): StringValue {
        return this.configService.get<StringValue>(
            'auth.passwordReset.otpExpiryMinutes',
            '15m',
        );
    }

    async execute(userId: string) {
        // ====================
        // Find User
        // ====================

        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // ====================
        // Generate OTP
        // ====================

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // ====================
        // Save OTP
        // ====================

        await this.verificationModel.findOneAndUpdate(
            {
                identifier: user.email,
            },
            {
                value: otpCode,

                expiresAt: new Date(Date.now() + ms(this.otpExpiryMinutes)),
            },
            {
                upsert: true,

                new: true,
            },
        );

        // ====================
        // Send Email
        // ====================

        await this.mailService.sendPasswordResetEmail(
            user.email,
            user.name,
            otpCode,
        );

        return {
            success: true,
            status: 200,
            message: 'Password reset email sent successfully',
            data: null,
        };
    }
}
