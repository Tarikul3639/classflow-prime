import {
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';

import { FetchAdminDashboardService } from './services/fetch-admin-dashboard.service';
import { AdminDashboardQueryDto } from './dto/admin-dashboard-query.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../infrastructure/database/interface/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)

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