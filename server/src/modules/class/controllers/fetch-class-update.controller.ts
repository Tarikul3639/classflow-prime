import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FetchClassUpdateResponseDto } from '../dto/fetch-class-update.dto';
import { FetchClassUpdateService } from '../services/updates/fetch-class-update.service';
import { ClassRoleGuard } from '../guards/class-role.guard';
import { ClassRole } from '../decorators/class-role.decorator';
import { EnrollmentRole } from '../../../infrastructure/database/interface/enrollment.interface';

import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('Class Updates')
@Controller('classes/:classId/updates')
export class FetchClassUpdateController {
  constructor(
    private readonly fetchClassUpdateService: FetchClassUpdateService,
  ) { }

  @Get()
  @UseGuards(ClassRoleGuard)
  @ClassRole(
    EnrollmentRole.INSTRUCTOR,
    EnrollmentRole.ASSISTANT,
    EnrollmentRole.LEARNER,
  )
  @ApiOperation({ summary: 'Fetch all class updates' })
  @ApiResponse({
    status: 200,
    description: 'Class updates fetched successfully',
    type: FetchClassUpdateResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Class not found',
  })
  async fetchClassUpdate(
    @CurrentUser() currentUser: { userId: string },
    @Param('classId') classId: string,
  ): Promise<FetchClassUpdateResponseDto> {
    return this.fetchClassUpdateService.execute(
      currentUser.userId,
      classId,
    );
  }
}