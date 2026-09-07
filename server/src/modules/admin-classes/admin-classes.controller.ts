import { Get, Controller, UseGuards, Query, Param, Patch, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { FetchAdminClassStatsService } from './services/fetch-admin-class-stats.service';
import { FetchAdminClassesService } from './services/fetch-admin-classes.service';
import { FetchAdminClassMembersService } from './services/fetch-admin-class-members.service';
import { BlockAdminClassService } from './services/block-admin-class.service';
import { UnBlockAdminClassService } from './services/unblock-admin-class.service';
import { UpdateAdminClassStatusService } from './services/update-admin-class-status.service';
import { UpdateAdminClassEnrollmentService } from './services/update-admin-class-enrollment.service';
import { UpdateAdminClassMemberRoleService } from './services/update-admin-class-member-role.service';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { AdminClassStatsDto } from './dto/admin-class-stats.dto';
import { AdminClassesDto } from './dto/admin-classes.dto';
import { AdminClassQueryDto } from './dto/admin-class-query.dto';
import { AdminClassMembersDto } from './dto/admin-class-members-response.dto';
import { BlockAdminClassDto } from './dto/block-admin-class.dto';
import { UnblockAdminClassDto } from './dto/unblock-admin-class.dto';
import { UpdateAdminClassStatusDto } from './dto/update-admin-class-status.dto';
import { UpdateAdminClassEnrollmentDto } from './dto/update-admin-class-enrollment.dto';
import { UpdateAdminClassMemberRoleDto } from './dto/update-admin-class-member-role.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../infrastructure/database/interface/user.interface';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Admin Classes')
@Controller('admin/classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only allow access to users with the 'admin' role
export class AdminClassesController {
    constructor(
        private readonly fetchAdminClassStatsService: FetchAdminClassStatsService,
        private readonly fetchAdminClassesService: FetchAdminClassesService,
        private readonly fetchAdminClassMembersService: FetchAdminClassMembersService,
        private readonly blockAdminClassService: BlockAdminClassService,
        private readonly unblockAdminClassService: UnBlockAdminClassService,
        private readonly updateAdminClassStatusService: UpdateAdminClassStatusService,
        private readonly updateAdminClassEnrollmentService: UpdateAdminClassEnrollmentService,
        private readonly updateAdminClassMemberRoleService: UpdateAdminClassMemberRoleService,
    ) { }

    @Get('stats')
    @ApiResponse({
        status: 200,
        description: 'Successfully fetched admin class statistics',
        type: ApiResponseDto<AdminClassStatsDto>,
    })
    async getAdminClassStats(): Promise<ApiResponseDto<AdminClassStatsDto>> {
        return this.fetchAdminClassStatsService.fetchAdminClassStats();
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Successfully fetched admin classes',
        type: Object,
    })
    async getAdminClasses(
        @Query() query: AdminClassQueryDto,
    ): Promise<AdminClassesDto> {
        return this.fetchAdminClassesService.execute(query);
    }

    @Get(':classId/members')
    @ApiResponse({
        status: 200,
        description: 'Successfully fetched admin class members',
        type: Object,
    })
    async getAdminClassMembers(
        @Param('classId') classId: string,
    ): Promise<AdminClassMembersDto> {
        return this.fetchAdminClassMembersService.execute(classId);
    }

    @Patch(':classId/block')
    @ApiResponse({
        status: 200,
        description: 'Successfully blocked the class',
        type: Object,
    })
    async blockAdminClass(
        @Param('classId') classId: string,
        @Body() dto: BlockAdminClassDto,
        @CurrentUser() CurrentUser: { userId: string },
    ): Promise<void> {
        return this.blockAdminClassService.execute(
            CurrentUser.userId,
            classId,
            dto,
        );
    }

    @Patch(':classId/unblock')
    @ApiResponse({
        status: 200,
        description: 'Successfully unblocked the class',
        type: Object,
    })
    async unblockAdminClass(
        @Param('classId') classId: string,
        @Body() dto: UnblockAdminClassDto,
    ): Promise<void> {
        return this.unblockAdminClassService.execute(classId, dto.isBlocked);
    }

    @Patch(':classId/status')
    @ApiResponse({
        status: 200,
        description: 'Successfully updated the class status',
        type: Object,
    })
    async updateAdminClassStatus(
        @Param('classId') classId: string,
        @Body() dto: UpdateAdminClassStatusDto,
    ): Promise<void> {
        return this.updateAdminClassStatusService.execute(classId, dto);
    }

    @Patch(':classId/enrollment')
    @ApiResponse({
        status: 200,
        description: 'Successfully updated the class enrollment',
        type: Object,
    })
    async updateAdminClassEnrollment(
        @Param('classId') classId: string,
        @Body() dto: UpdateAdminClassEnrollmentDto,
    ): Promise<void> {
        return this.updateAdminClassEnrollmentService.execute(classId, dto);
    }

    @Patch(':classId/members/:memberId/role')
    @ApiResponse({
        status: 200,
        description: 'Successfully updated the class member role',
        type: Object,
    })
    async updateAdminClassMemberRole(
        @Param('classId') classId: string,
        @Param('memberId') memberId: string,
        @Body() dto: UpdateAdminClassMemberRoleDto,
    ): Promise<void> {
        return this.updateAdminClassMemberRoleService.execute(classId, memberId, dto);
    }
}
