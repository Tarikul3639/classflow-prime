import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
    User,
    UserSchema,
} from '../../infrastructure/database/entities/user.entity';

import {
    ActivityLog,
    ActivityLogSchema,
} from '../../infrastructure/database/entities/activity-log.entity';

import {
    Enrollment,
    EnrollmentSchema
} from "../../infrastructure/database/entities/enrollment.entity"

import { AdminUsersController } from './admin-users.controller';

import { FetchAdminUsersService } from './services/fetch-admin-users.service';
import { FetchAdminUserService } from './services/fetch-admin-user.service';
import { UpdateAdminUserStatusService } from './services/update-admin-user-status.service';
import { FetchAdminUserActivityService } from './services/fetch-admin-user-activity.service';

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
                schema: EnrollmentSchema
            }
        ]),
    ],

    controllers: [
        AdminUsersController,
    ],

    providers: [
        FetchAdminUsersService,
        FetchAdminUserService,
        UpdateAdminUserStatusService,
        FetchAdminUserActivityService,
    ],
})
export class AdminUsersModule { }