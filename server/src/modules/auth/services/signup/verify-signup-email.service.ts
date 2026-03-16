import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { VerifySignupEmailDto } from '../../dto/signup/verify-signup-email.dto';
import { User, UserDocument } from '../../../../database/entities/user.entity';
import { MailService } from '../../../../modules/mail/services/mail.service';
import { TokenService } from '../token/token.service';
import { UserSanitizerService } from '../sanitizer/user-sanitizer.service';
import { EmailValidator } from 'src/shared/utils/email-validator.util';
import { IUser } from 'src/database/interface/user.interface';
import { ITokens } from '../token/token.types';

export class SignUpResponseDto {
    message: string;
    user: Partial<IUser> | null;
    tokens: ITokens;
}
@Injectable()
export class VerifySignupEmailService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly mailService: MailService,
        private readonly sanitizer: UserSanitizerService,
        private readonly tokenService: TokenService,
    ) { }

    async execute(dto: VerifySignupEmailDto) {
        // 1) basic format check (so user gets clean message)
        if (!EmailValidator.isValidFormat(dto.email)) {
            throw new BadRequestException('Invalid email format');
        }

        // 2) disposable / temporary email block (this throws your message)
        EmailValidator.validateOrThrow(dto.email);

        // 3) load user with verification fields (select:false)
        const user: UserDocument | null = await this.userModel
            .findOne({ email: dto.email })
            .select('+emailVerificationCode +emailVerificationExpiresAt');

        // 4) user existence and verification status check
        if (!user) throw new NotFoundException('User not found');

        // 5) check if already verified
        if (user.isEmailVerified) {
            return {
                message: 'Email already verified',
                user: this.sanitizer.sanitize(user),
                tokens: { accessToken: '', refreshToken: '' }, // empty tokens since already verified
            };
        }

        // 6) verify code and expiration
        user.verifyEmailCode(dto.code);

        // 7) mark email as verified and clear verification fields
        const tokens = await this.tokenService.signTokens({
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // 8) Save the refresh token in the database (optional, but recommended for security)
        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push(tokens.refreshToken);

        // 9) mark email as verified and clear verification fields
        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpiresAt = undefined;

        user.lastLogin = new Date();
        await user.save();

        // 10) optional: send welcome email
        await this.mailService.sendWelcomeEmail(
            user.email,
            user.fullName || user.firstName,
        );

        // 11) return success message and optionally tokens for auto-login
        const result: SignUpResponseDto = {
            message: 'Email verified successfully',
            user: this.sanitizer.sanitize(user),
            tokens,
        };
        return result;
    }
}
