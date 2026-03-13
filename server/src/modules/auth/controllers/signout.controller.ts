import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import type { IJwtPayload } from '../interfaces/jwt-payload.interface';

import { SignOutDto } from '../dto/signout/signout.dto';
import { SignOutService } from '../services/signout/signout.service';

@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
@Controller('auth/signout')
export class SignoutController {
  constructor(private readonly signOutService: SignOutService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out (current device)' })
  @ApiResponse({ status: 200, description: 'Signed out successfully' })
  async signoutCurrent(
    @CurrentUser() user: IJwtPayload,
    @Body() dto: SignOutDto,
  ) {
    return this.signOutService.execute(user.sub.toString(), dto.refreshToken);
  }

  @Post('all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out (all devices)' })
  @ApiResponse({ status: 200, description: 'Signed out from all devices' })
  async signoutAll(@CurrentUser() user: IJwtPayload) {
    return this.signOutService.signOutAll(user.sub.toString());
  }
}