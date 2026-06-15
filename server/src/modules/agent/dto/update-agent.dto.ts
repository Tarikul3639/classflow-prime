import { PartialType } from '@nestjs/swagger';

import {
  CreateAgentRequestDto,
} from './create-agent.dto';

export class UpdateAgentRequestDto
  extends PartialType(
    CreateAgentRequestDto,
  ) {}