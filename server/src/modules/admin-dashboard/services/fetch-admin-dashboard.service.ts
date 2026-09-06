import { Injectable } from '@nestjs/common';

import { AdminDashboardQueryDto } from '../dto/admin-dashboard-query.dto';
import { AdminDashboardResponseWrapperDto } from '../dto/admin-dashboard-response.dto';

import { FetchAdminDashboardStatsService } from './fetch-admin-dashboard-stats.service';
import { FetchAdminRecentUsersService } from './fetch-admin-recent-users.service';
import { FetchAdminRecentClassesService } from './fetch-admin-recent-classes.service';
import { FetchAdminUserVerificationService } from './fetch-admin-user-verification.service';
import { FetchUserGrowthService } from './fetch-user-growth.service';

@Injectable()
export class FetchAdminDashboardService {
    constructor(
        private readonly fetchAdminDashboardStatsService: FetchAdminDashboardStatsService,
        private readonly fetchAdminRecentUsersService: FetchAdminRecentUsersService,
        private readonly fetchAdminRecentClassesService: FetchAdminRecentClassesService,
        private readonly fetchAdminUserVerificationService: FetchAdminUserVerificationService,
        private readonly fetchUserGrowthService: FetchUserGrowthService,
    ) { }

    async execute(query: AdminDashboardQueryDto): Promise<AdminDashboardResponseWrapperDto> {
        const { recentUsersLimit, recentClassesLimit } = query;

        const [stats, recentUsers, recentClasses, userVerification, userStatistics] = await Promise.all([
            this.fetchAdminDashboardStatsService.fetchStats(),
            this.fetchAdminRecentUsersService.fetchRecentUsers(recentUsersLimit),
            this.fetchAdminRecentClassesService.fetchRecentClasses(recentClassesLimit),
            this.fetchAdminUserVerificationService.execute(),
            this.fetchUserGrowthService.execute(),
        ]);

        return {
            success: true,
            message: 'Admin dashboard data fetched successfully',
            data: {
                stats,
                recentUsers,
                recentClasses,
                userVerification,
                userStatistics,
            },
        };
    }
}