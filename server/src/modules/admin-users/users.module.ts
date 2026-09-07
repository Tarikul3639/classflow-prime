import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";

import {
    User,
    UserSchema,
} from "../../infrastructure/database/entities/user.entity";

import {
    ActivityLog,
    ActivityLogSchema,
} from "../../infrastructure/database/entities/activity-log.entity";

import {
    Enrollment,
    EnrollmentSchema,
} from "../../infrastructure/database/entities/enrollment.entity";

import {
    Verification,
    VerificationSchema,
} from "../../infrastructure/database/entities/verification.entity";

import { MailModule } from "../../infrastructure/mail/mail.module";

import { AdminUsersController } from "./admin-users.controller";

import { FetchAdminUsersService } from "./services/fetch-admin-users.service";
import { FetchAdminUserService } from "./services/fetch-admin-user.service";
import { UpdateAdminUserStatusService } from "./services/update-admin-user-status.service";
import { FetchAdminUserActivityService } from "./services/fetch-admin-user-activity.service";
import { FetchAdminUserStatsService } from "./services/fetch-admin-user-stats.service";
import { UpdateAdminUserRoleService } from "./services/update-admin-user-role.service";
import { VerifyAdminUserEmailService } from "./services/verify-admin-user-email.service";
import { SendAdminPasswordResetEmailService } from "./services/send-password-reset-email.service";


@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },

            {
                name: ActivityLog.name,
                schema: ActivityLogSchema,
            },

            {
                name: Enrollment.name,
                schema: EnrollmentSchema,
            },

            {
                name: Verification.name,
                schema: VerificationSchema,
            },
        ]),

        MailModule,
    ],

    controllers: [
        AdminUsersController,
    ],

    providers: [
        FetchAdminUsersService,
        FetchAdminUserService,
        UpdateAdminUserStatusService,
        FetchAdminUserActivityService,
        FetchAdminUserStatsService,
        UpdateAdminUserRoleService,
        VerifyAdminUserEmailService,
        SendAdminPasswordResetEmailService,
    ],
})
export class AdminUsersModule { }