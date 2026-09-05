import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    User,
    UserDocument,
} from '../../../infrastructure/database/entities/user.entity';

import {
    Class,
    ClassDocument,
} from '../../../infrastructure/database/entities/class.entity';

import {
    Enrollment,
    EnrollmentDocument,
} from '../../../infrastructure/database/entities/enrollment.entity';

import {
    Faculty,
    FacultyDocument,
} from '../../../infrastructure/database/entities/faculty.entity';

import {
    Agent,
    AgentDocument,
} from '../../../infrastructure/database/entities/agent.entity';

import { AdminDashboardStatsDto } from '../dto/admin-dashboard-stats.dto';

import { ClassStatus } from '../../../infrastructure/database/interface/class.interface';

import { AgentStatus } from '../../../infrastructure/database/interface/agent.interface';

@Injectable()
export class FetchAdminDashboardStatsService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(Class.name)
        private readonly classModel: Model<ClassDocument>,

        @InjectModel(Faculty.name)
        private readonly facultyModel: Model<FacultyDocument>,

        @InjectModel(Agent.name)
        private readonly agentModel: Model<AgentDocument>,

        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<EnrollmentDocument>,
    ) { }

    async fetchStats(): Promise<AdminDashboardStatsDto> {
        const [
            totalUsers,
            totalClasses,
            activeClasses,
            totalEnrollments,
            totalFaculty,
            totalAgents,
            activeAgents,
        ] = await Promise.all([
            // Total users
            this.userModel.countDocuments(),

            // Total classes
            this.classModel.countDocuments(),

            // Active classes
            this.classModel.countDocuments({
                status: ClassStatus.ACTIVE,
            }),

            // Total enrollments
            this.enrollmentModel.countDocuments(),

            // Total faculty
            this.facultyModel.countDocuments(),

            // Total AI agents
            this.agentModel.countDocuments(),

            // Active AI agents
            this.agentModel.countDocuments({
                status: AgentStatus.ACTIVE,
            }),
        ]);

        return {
            totalUsers,
            totalClasses,
            activeClasses,
            totalEnrollments,
            totalFaculty,
            totalAgents,
            activeAgents,
        };
    }
}