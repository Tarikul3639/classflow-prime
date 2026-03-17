import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ForbiddenException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { VerifySignupEmailDto } from '../../dto/signup/verify-signup-email.dto';
import { User, UserDocument } from 'src/database/entities/user.entity';
import { IUser } from 'src/database/interface/user.interface';
import { Account, AccountDocument } from 'src/database/entities/account.entity';
import { IAccount, AccountProvider } from 'src/database/interface/account.interface';
import {
    Verification,
    VerificationDocument,
} from 'src/database/entities/verification.entity';
import { Session, SessionDocument } from 'src/database/entities/session.entity';
import { ISession } from 'src/database/interface/session.interface';
import { ITokens } from '../token/token.types';

import { MailService } from '../../../../modules/mail/services/mail.service';
import { TokenService } from '../token/token.service';
import { EmailValidator } from 'src/shared/utils/email-validator.util';

export class SignUpResponseDto {
    message: string;
    user: Partial<IUser> | null;
    tokens: ITokens;
}

@Injectable()
export class VerifySignupEmailService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument & IUser>,
        @InjectModel(Account.name)
        private readonly accountModel: Model<AccountDocument>,
        @InjectModel(Verification.name)
        private readonly verificationModel: Model<VerificationDocument>,
        private readonly mailService: MailService,
        private readonly tokenService: TokenService,
    ) { }

    async execute(dto: VerifySignupEmailDto) {
        const email = dto.email.toLowerCase().trim();

        // 1️) Validate email format
        if (!EmailValidator.isValidFormat(email)) {
            throw new BadRequestException('Invalid email format');
        }

        // 2️) Disposable / temporary email block
        EmailValidator.validateOrThrow(email);

        // 3️) Load user
        const user = await this.userModel.findOne({ email });
        if (!user) throw new NotFoundException('User not found');

        // 4️) Already verified?
        if (user.emailVerified) {
            return {
                message: 'Email already verified',
                user: null,
                tokens: { accessToken: '', refreshToken: '' },
            } as SignUpResponseDto;
        }

        // 5️) Load verification token
        const verificationToken = await this.verificationModel.findOne({
            identifier: email,
            value: dto.code,
            expiresAt: { $gt: new Date() },
        });

        if (!verificationToken) {
            throw new ForbiddenException('Invalid or expired verification code');
        }

        const session = await this.userModel.db.startSession();
        try {
            session.startTransaction();

            // 6️) Mark user as verified
            user.emailVerified = true;
            await user.save({ session });

            // 7️) Delete used verification token
            await verificationToken.deleteOne({ session });

            // 8️) Generate JWT tokens
            const tokens: ITokens = await this.tokenService.signTokens({
                sub: user._id.toString(),
                email: user.email,
                role: user.role,
            });

            // 9️) Optional: store refresh token in Account (hashed)
            let account = await this.accountModel
                .findOne({
                    userId: user._id,
                    providerId: AccountProvider.PASSWORD,
                })
                .session(session);

            if (!account) {
                account = new this.accountModel({
                    userId: user._id,
                    accountId: email,
                    providerId: AccountProvider.PASSWORD,
                });
            }

            await account.save({ session });

            await session.commitTransaction();
            session.endSession();

            // 10️) Optional welcome email
            await this.mailService.sendWelcomeEmail(user.email, user.name);

            // 11️) Return sanitized user + tokens
            const userData: IUser = {
                _id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
                avatarUrl: user.avatarUrl,
                emailVerified: user.emailVerified,
            };
            return {
                message: 'Email verified successfully',
                user: userData,
                tokens,
            } as SignUpResponseDto;
        } catch (err: unknown) {
            await session.abortTransaction();
            session.endSession();
            throw new InternalServerErrorException(
                'Failed to verify email. Please try again.',
            );
        }
    }
}
