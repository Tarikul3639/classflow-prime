import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    User,
    UserDocument,
} from '../../../infrastructure/database/entities/user.entity';

import { AdminUserVerificationDto } from '../dto/admin-user-verification.dto';

@Injectable()
export class FetchAdminUserVerificationService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async execute(): Promise<AdminUserVerificationDto> {
        const [verified, unverified] = await Promise.all([
            this.userModel.countDocuments({
                emailVerified: true,
            }),

            this.userModel.countDocuments({
                emailVerified: false,
            }),
        ]);

        return {
            verified,
            unverified,
        };
    }
}