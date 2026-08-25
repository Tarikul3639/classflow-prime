import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../../common/decorators/current-user.decorator';

import { ClassRole } from '../decorators/class-role.decorator';
import { ClassRoleGuard } from '../guards/class-role.guard';
import { EnrollmentRole } from '../../../infrastructure/database/interface/enrollment.interface';

import {
    CreateClassUpdateCommentRequestDto,
    CreateClassUpdateCommentResponseDto,
} from '../dto/create-class-update-comment.dto';

import { CreateClassUpdateCommentService } from '../services/updates/create-class-update-comment.service';
import { DeleteClassUpdateCommentService } from '../services/updates/delete-class-update-comment.service';

@ApiTags('Class Update Comments')
@Controller('classes/:classId/updates/:updateId/comments')
export class ClassUpdateCommentController {
    constructor(
        private readonly createClassUpdateCommentService: CreateClassUpdateCommentService,
        private readonly deleteClassUpdateCommentService: DeleteClassUpdateCommentService,
    ) { }

    @Post()
    @UseGuards(ClassRoleGuard)
    @ClassRole(
        EnrollmentRole.INSTRUCTOR,
        EnrollmentRole.ASSISTANT,
        EnrollmentRole.LEARNER,
    )
    @ApiOperation({
        summary: 'Create a comment on a class update',
    })
    @ApiResponse({
        status: 201,
        description: 'Comment created successfully',
        type: CreateClassUpdateCommentResponseDto,
    })
    async createComment(
        @CurrentUser() currentUser: { userId: string },
        @Param('classId') classId: string,
        @Param('updateId') updateId: string,
        @Body() body: CreateClassUpdateCommentRequestDto,
    ): Promise<CreateClassUpdateCommentResponseDto> {
        return this.createClassUpdateCommentService.execute(
            currentUser.userId,
            classId,
            updateId,
            body,
        );
    }

    @Delete(':commentId')
    @UseGuards(ClassRoleGuard)
    @ClassRole(
        EnrollmentRole.INSTRUCTOR,
        EnrollmentRole.ASSISTANT,
        EnrollmentRole.LEARNER,
    )
    @ApiOperation({
        summary: 'Delete a comment from a class update',
    })
    async deleteComment(
        @CurrentUser() CurrentUser: { userId: string },
        @Param('classId') classId: string,
        @Param('updateId') updateId: string,
        @Param('commentId') commentId: string,
    ) {
        return this.deleteClassUpdateCommentService.execute(
            CurrentUser.userId,
            classId,
            updateId,
            commentId,
        );
    }
}