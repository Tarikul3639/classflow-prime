import { Injectable } from '@nestjs/common';

import { AdminDashboardQueryDto } from '../dto/admin-dashboard-query.dto';
import { AdminDashboardResponseWrapperDto } from '../dto/admin-dashboard-response.dto';

import { FetchAdminDashboardStatsService } from './fetch-admin-dashboard-stats.service';
import { FetchAdminRecentUsersService } from './fetch-admin-recent-users.service';
import { FetchAdminRecentClassesService } from './fetch-admin-recent-classes.service';

@Injectable()
export class FetchAdminDashboardService {
    constructor(
        private readonly fetchAdminDashboardStatsService: FetchAdminDashboardStatsService,
        private readonly fetchAdminRecentUsersService: FetchAdminRecentUsersService,
        private readonly fetchAdminRecentClassesService: FetchAdminRecentClassesService,
    ) { }

    async execute(query: AdminDashboardQueryDto): Promise<AdminDashboardResponseWrapperDto> {
        const { recentUsersLimit, recentClassesLimit } = query;

        const [stats, recentUsers, recentClasses] = await Promise.all([
            this.fetchAdminDashboardStatsService.fetchStats(),
            this.fetchAdminRecentUsersService.fetchRecentUsers(recentUsersLimit),
            this.fetchAdminRecentClassesService.fetchRecentClasses(recentClassesLimit),
        ]);

        return {
            success: true,
            message: 'Admin dashboard data fetched successfully',
            data: {
                stats,
                recentUsers,
                recentClasses,
            },
        };
    }
}