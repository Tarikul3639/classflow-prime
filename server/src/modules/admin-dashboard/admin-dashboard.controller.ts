import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';

import { FetchAdminDashboardService } from './services/fetch-admin-dashboard.service';
import { AdminDashboardQueryDto } from './dto/admin-dashboard-query.dto';

@Controller('admin/dashboard')
export class AdminDashboardController {
    constructor(
        private readonly fetchAdminDashboardService: FetchAdminDashboardService,
    ) { }

    @Get()
    async getDashboard(
        @Query() query: AdminDashboardQueryDto,
    ) {
        return this.fetchAdminDashboardService.execute(query);
    }
}