import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { SignUpDto } from '../../dto/signup/signup.dto';
import {
  User,
  UserDocument,
  UserStatus,
} from '../../../../database/entities/user.entity';
import { MailService } from '../../../../modules/mail/services/mail.service';
import { UserSanitizerService } from '../sanitizer/user-sanitizer.service';

@Injectable()
export class SignUpService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly sanitizer: UserSanitizerService,
  ) {}

  async execute(dto: SignUpDto) {
    const email = dto.email.toLowerCase().trim();
    const session = await this.userModel.db.startSession();

    try {
      session.startTransaction();

      const existing = await this.userModel.findOne({ email }).session(session);

      if (existing?.isEmailVerified) {
        throw new ConflictException('Email is already registered');
      }

      let user: UserDocument;
      let code: string;

      if (existing) {
        // resume signup
        existing.firstName = dto.firstName;
        existing.lastName = dto.lastName;
        existing.avatarUrl = dto.avatarUrl;

        existing.password = dto.password; // pre-save hashes it
        existing.status = UserStatus.PENDING_VERIFICATION;
        existing.isEmailVerified = false;

        code = existing.createEmailVerificationCode();
        existing.emailVerificationLastSentAt = new Date();

        user = await existing.save({ session });
      } else {
        const created = new this.userModel({
          firstName: dto.firstName,
          lastName: dto.lastName,
          email,
          password: dto.password, // pre-save hashes it
          avatarUrl: dto.avatarUrl,
          status: UserStatus.PENDING_VERIFICATION,
          isEmailVerified: false,
          refreshTokens: [],
        });

        code = created.createEmailVerificationCode();
        created.emailVerificationLastSentAt = new Date();

        user = await created.save({ session });
      }

      // mail failure => abort transaction => no user saved/updated
      await this.mailService.sendVerificationEmail(user.email, user.firstName, code);

      await session.commitTransaction();
      session.endSession();

      return {
        message: 'Signup successful. Verification code sent to email.',
        user: this.sanitizer.sanitize(user),
      };
    } catch (err: unknown) {
      await session.abortTransaction();
      session.endSession();

      if (err instanceof ConflictException) throw err;

      throw new InternalServerErrorException(
        'An error occurred during signup. Please try again.',
      );
    }
  }
}