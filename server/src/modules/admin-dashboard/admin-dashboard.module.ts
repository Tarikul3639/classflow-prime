import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';

// Controller
import { AdminDashboardController } from './admin-dashboard.controller';

// Services
import { FetchAdminDashboardService } from './services/fetch-admin-dashboard.service';
import { FetchAdminDashboardStatsService } from './services/fetch-admin-dashboard-stats.service';
import { FetchAdminRecentUsersService } from './services/fetch-admin-recent-users.service';
import { FetchAdminRecentClassesService } from './services/fetch-admin-recent-classes.service';
import { FetchAdminUserVerificationService } from './services/fetch-admin-user-verification.service';
import { FetchUserGrowthService } from './services/fetch-user-growth.service';

// Database Entities
import {
    Agent,
    AgentSchema,
} from '../../infrastructure/database/entities/agent.entity';

import {
    User,
    UserSchema,
} from '../../infrastructure/database/entities/user.entity';

import {
    Class,
    ClassSchema,
} from '../../infrastructure/database/entities/class.entity';

import {
    Faculty,
    FacultySchema,
} from '../../infrastructure/database/entities/faculty.entity';

import {
    Enrollment,
    EnrollmentSchema,
} from '../../infrastructure/database/entities/enrollment.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
            {
                name: Class.name,
                schema: ClassSchema,
            },
            {
                name: Enrollment.name,
                schema: EnrollmentSchema,
            },
            {
                name: Faculty.name,
                schema: FacultySchema,
            },
            {
                name: Agent.name,
                schema: AgentSchema,
            },
        ]),
        AuthModule,
    ],

    controllers: [
        AdminDashboardController,
    ],

    providers: [
        FetchAdminDashboardService,
        FetchAdminDashboardStatsService,
        FetchAdminRecentUsersService,
        FetchAdminRecentClassesService,
        FetchAdminUserVerificationService,
        FetchUserGrowthService,
    ],
})
export class AdminDashboardModule { }