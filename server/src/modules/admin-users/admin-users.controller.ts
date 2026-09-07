import { Body, Controller, Get, Post, Param, Patch, Query } from '@nestjs/common';

import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FetchAdminUsersService } from './services/fetch-admin-users.service';
import { FetchAdminUserService } from './services/fetch-admin-user.service';
import { UpdateAdminUserStatusService } from './services/update-admin-user-status.service';
import { FetchAdminUserActivityService } from './services/fetch-admin-user-activity.service';
import { FetchAdminUserStatsService } from './services/fetch-admin-user-stats.service';
import { UpdateAdminUserRoleService } from './services/update-admin-user-role.service';
import { VerifyAdminUserEmailService } from './services/verify-admin-user-email.service';
import { SendAdminPasswordResetEmailService } from './services/send-password-reset-email.service';

import { AdminUserQueryDto } from './dto/admin-user-query.dto';
import { AdminUserStatsDto } from './dto/admin-user-stats.dto';
import { UpdateAdminUserStatusDto } from './dto/update-admin-user-status.dto';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { AdminUserDto } from './dto/admin-user.dto';
// import { AdminUserActivityDto } from './dto/admin-user-activity.dto';
import { UpdateAdminUserRoleDto } from './dto/update-admin-user-role.dto';

@ApiTags('Admin Users')
@Controller('admin/users')
export class AdminUsersController {
    constructor(
        private readonly fetchAdminUsersService: FetchAdminUsersService,
        private readonly fetchAdminUserService: FetchAdminUserService,
        private readonly updateAdminUserStatusService: UpdateAdminUserStatusService,
        private readonly fetchAdminUserActivityService: FetchAdminUserActivityService,
        private readonly fetchAdminUserStatsService: FetchAdminUserStatsService,
        private readonly updateAdminUserRoleService: UpdateAdminUserRoleService,
        private readonly verifyAdminUserEmailService: VerifyAdminUserEmailService,
        private readonly sendAdminPasswordResetEmailService: SendAdminPasswordResetEmailService,
    ) { }

    // ================================
    // Get User Statistics
    // ================================

    @Get('stats')
    @ApiOperation({
        summary: 'Get user statistics',
        description:
            'Returns overall statistics for users including total, active, suspended, verified and unverified users.',
    })
    @ApiResponse({
        status: 200,
        description: 'User statistics fetched successfully',
        type: AdminUserStatsDto,
    })
    async getUserStats(): Promise<ApiResponseDto<AdminUserStatsDto>> {
        return this.fetchAdminUserStatsService.execute();
    }

    // ================================
    // Get Users
    // ================================

    @Get()
    @ApiOperation({
        summary: 'Get users',
        description:
            'Returns a paginated list of users with optional search, role, status, email verification and sorting filters.',
    })
    @ApiResponse({
        status: 200,
        description: 'Users fetched successfully',
        type: AdminUserResponseDto,
    })
    async getUsers(
        @Query() query: AdminUserQueryDto,
    ): Promise<ApiResponseDto<AdminUserResponseDto>> {
        return this.fetchAdminUsersService.execute(query);
    }

    // ================================
    // Get Single User
    // ================================

    @Get(':id')
    @ApiOperation({
        summary: 'Get user by ID',
        description: 'Returns detailed information for a specific user.',
    })
    @ApiParam({
        name: 'id',
        description: 'User MongoDB ID',
        example: '66b8f0a1e2c3d4f5a6b7c8d9',
    })
    @ApiResponse({
        status: 200,
        description: 'User fetched successfully',
        type: AdminUserDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async getUser(
        @Param('id') userId: string,
    ): Promise<ApiResponseDto<AdminUserDto>> {
        return this.fetchAdminUserService.execute(userId);
    }

    // ================================
    // Update User Status
    // ================================

    @Patch(':id/status')
    @ApiOperation({
        summary: 'Update user status',
        description:
            'Updates the status of a specific user. For example: active, inactive, or suspended.',
    })
    @ApiParam({
        name: 'id',
        description: 'User MongoDB ID',
        example: '66b8f0a1e2c3d4f5a6b7c8d9',
    })
    @ApiResponse({
        status: 200,
        description: 'User status updated successfully',
        type: AdminUserDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async updateUserStatus(
        @Param('id') userId: string,

        @Body() dto: UpdateAdminUserStatusDto,
    ): Promise<ApiResponseDto<AdminUserDto>> {
        return this.updateAdminUserStatusService.execute(userId, dto);
    }

    // ================================
    // Update User Role
    // ================================

    @Patch(':id/role')
    @ApiOperation({
        summary: 'Update user role',
        description:
            'Updates the role of a specific user. For example: user, admin, or super_admin.',
    })
    @ApiParam({
        name: 'id',
        description: 'User MongoDB ID',
        example: '66b8f0a1e2c3d4f5a6b7c8d9',
    })
    @ApiResponse({
        status: 200,
        description: 'User role updated successfully',
        type: AdminUserDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async updateUserRole(
        @Param('id') userId: string,

        @Body() dto: UpdateAdminUserRoleDto,
    ): Promise<ApiResponseDto<AdminUserDto>> {
        return this.updateAdminUserRoleService.execute(userId, dto);
    }

    // ================================
    // Send Password Reset Email
    // ================================

    @Post(':id/send-password-reset-email')
    @ApiOperation({
        summary: 'Send password reset email',
        description:
            'Sends a password reset email to the specified user.',
    })
    @ApiParam({
        name: 'id',
        description: 'User MongoDB ID',
        example: '66b8f0a1e2c3d4f5a6b7c8d9',
    })
    @ApiResponse({
        status: 200,
        description: 'Password reset email sent successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async sendPasswordResetEmail(
        @Param('id') userId: string,
    ): Promise<ApiResponseDto<null>> {
        return this.sendAdminPasswordResetEmailService.execute(userId);
    }

    // ================================
    // Verify User Email
    // ================================

    @Patch(':id/verify-email')
    @ApiOperation({
        summary: 'Verify user email',
        description:
            'Marks the email of a specific user as verified.',
    })
    @ApiParam({
        name: 'id',
        description: 'User MongoDB ID',
        example: '66b8f0a1e2c3d4f5a6b7c8d9',
    })
    @ApiResponse({
        status: 200,
        description: 'User email verified successfully',
        type: AdminUserDto,
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async verifyUserEmail(
        @Param('id') userId: string,
    ): Promise<ApiResponseDto<AdminUserDto>> {
        return this.verifyAdminUserEmailService.execute(userId);
    }

    // ================================
    // Get User Activity
    // ================================

    @Get(':id/activity')
    @ApiOperation({
        summary: 'Get user activity logs',
        description: 'Returns the activity logs for a specific user.',
    })
    @ApiParam({
        name: 'id',
        description: 'User MongoDB ID',
        example: '66b8f0a1e2c3d4f5a6b7c8d9',
    })
    @ApiResponse({
        status: 200,
        description: 'User activity logs fetched successfully',
        // type: [AdminUserActivityDto],
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async getUserActivity(@Param('id') userId: string): Promise<any[]> {
        return this.fetchAdminUserActivityService.execute(userId);
    }
}

