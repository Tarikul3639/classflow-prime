import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import {
    Enrollment,
    EnrollmentSchema,
} from '../../infrastructure/database/entities/enrollment.entity';
import {
    Class,
    ClassSchema,
} from '../../infrastructure/database/entities/class.entity';
import {
    User,
    UserSchema,
} from '../../infrastructure/database/entities/user.entity';

import { AdminClassesController } from './admin-classes.controller';
import { FetchAdminClassStatsService } from './services/fetch-admin-class-stats.service';
import { FetchAdminClassesService } from './services/fetch-admin-classes.service';
import { FetchAdminClassMembersService } from './services/fetch-admin-class-members.service';
import { BlockAdminClassService } from './services/block-admin-class.service';
import { UnBlockAdminClassService } from './services/unblock-admin-class.service';
import { UpdateAdminClassStatusService } from './services/update-admin-class-status.service';
import { UpdateAdminClassEnrollmentService } from './services/update-admin-class-enrollment.service';
import { UpdateAdminClassMemberRoleService } from './services/update-admin-class-member-role.service';

import { AuthModule } from '../../modules/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Enrollment.name, schema: EnrollmentSchema },
            { name: Class.name, schema: ClassSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [AdminClassesController],
    providers: [
        FetchAdminClassStatsService,
        FetchAdminClassesService,
        FetchAdminClassMembersService,
        BlockAdminClassService,
        UnBlockAdminClassService,
        UpdateAdminClassStatusService,
        UpdateAdminClassEnrollmentService,
        UpdateAdminClassMemberRoleService,
    ],
})
export class AdminClassesModule { }
