import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import type { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { GetCurrentUserService } from '../services/me/get-current-user.service';

@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
@Controller('auth/me')
export class MeController {
  constructor(private readonly getCurrentUserService: GetCurrentUserService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Returns current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@CurrentUser() user: IJwtPayload) {
    return this.getCurrentUserService.execute(user.sub.toString());
  }
}