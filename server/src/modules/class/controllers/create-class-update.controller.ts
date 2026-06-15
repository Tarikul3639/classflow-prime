import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { 
  CreateClassUpdateRequestDto, 
  CreateClassUpdateResponseDto 
} from '../dto/create-class-update.dto';
import { CreateClassUpdateService } from '../services/create-class-update.service';
import { CurrentActor } from '../../auth/decorators/current-actor.decorator';
import { HybridAuthGuard } from '../../auth/guards/hybrid-auth.guard';
import type { IActor } from '../../auth/interfaces/actor.interface';

@ApiTags('Class')
@Controller('classes')
export class CreateClassUpdateController {
  constructor(
    private readonly createClassUpdateService: CreateClassUpdateService,
  ) {}

  @Post(':classId/updates')
  @UseGuards(HybridAuthGuard)
  @ApiOperation({ summary: 'Create a new update for a class' })
  @ApiResponse({ status: 201, description: 'Class update created successfully' })
  async createClassUpdate(
    @CurrentActor() actor: IActor,
    @Param('classId') classId: string,
    @Body() dto: CreateClassUpdateRequestDto,
  ): Promise<CreateClassUpdateResponseDto> {
    return await this.createClassUpdateService.execute(classId, actor, dto);
  }
}