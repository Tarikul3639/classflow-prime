import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { ResetPasswordDto } from '../../dto/password-reset/reset-password.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { MailService } from '../../../../modules/mail/services/mail.service';

@Injectable()
export class ConfirmPasswordResetService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly mailService: MailService,
    ) { }

    async execute(dto: ResetPasswordDto) {
        const email = dto.email.toLowerCase().trim();

        // must select hidden reset fields
        const user = await this.userModel.findOne({ email }).select('+passwordResetCode +passwordResetExpiresAt +passwordResetAttempts +lastPasswordResetRequestAt');

        if (!user) throw new NotFoundException('User not found');

        // use entity method (no OtpService)
        user.verifyResetCode(dto.code);

        // IMPORTANT: do NOT bcrypt.hash here because pre-save already hashes when password modified
        user.password = dto.newPassword;

        // clear reset fields
        user.passwordResetCode = undefined;
        user.passwordResetExpiresAt = undefined;
        user.passwordResetAttempts = 0;
        user.lastPasswordResetRequestAt = undefined;

        // invalidate sessions
        user.refreshTokens = [];

        await user.save();

        // optional: do not fail reset if mail fails
        try {
            await this.mailService.sendPasswordChangedEmail(
                user.email,
                (user as { fullName: string }).fullName || user.firstName,
            );
        } catch { }

        return { message: 'Password reset successfully' };
    }
}
