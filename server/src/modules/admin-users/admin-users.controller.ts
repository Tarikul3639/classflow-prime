import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Query,
} from '@nestjs/common';

import { FetchAdminUsersService } from './services/fetch-admin-users.service';
import { FetchAdminUserService } from './services/fetch-admin-user.service';
import { UpdateAdminUserStatusService } from './services/update-admin-user-status.service';
import { FetchAdminUserActivityService } from './services/fetch-admin-user-activity.service';

import { AdminUserQueryDto } from './dto/admin-user-query.dto';
import { UpdateAdminUserStatusDto } from './dto/update-admin-user-status.dto';

@Controller('admin/users')
export class AdminUsersController {
    constructor(
        private readonly fetchAdminUsersService: FetchAdminUsersService,
        private readonly fetchAdminUserService: FetchAdminUserService,
        private readonly updateAdminUserStatusService: UpdateAdminUserStatusService,
        private readonly fetchAdminUserActivityService: FetchAdminUserActivityService,
    ) { }

    // ==================== Get Users ====================

    @Get()
    async getUsers(
        @Query() query: AdminUserQueryDto,
    ) {
        return this.fetchAdminUsersService.execute(query);
    }

    // ==================== Get Single User ====================

    @Get(':id')
    async getUser(
        @Param('id') userId: string,
    ) {
        return this.fetchAdminUserService.execute(userId);
    }

    // ==================== Update User Status ====================

    @Patch(':id/status')
    async updateUserStatus(
        @Param('id') userId: string,

        @Body() dto: UpdateAdminUserStatusDto,
    ) {
        return this.updateAdminUserStatusService.execute(
            userId,
            dto,
        );
    }

    // ==================== Get User Activity ====================

    @Get(':id/activity')
    async getUserActivity(
        @Param('id') userId: string,
    ) {
        return this.fetchAdminUserActivityService.execute(userId);
    }
}