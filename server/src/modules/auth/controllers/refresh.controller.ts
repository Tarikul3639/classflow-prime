import {
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { TokenService } from '../services/token/token.service';
import { setAuthCookies } from '../../../shared/utils/auth-cookies.util';
import { Public } from '../../../shared/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class RefreshController {
  constructor(private readonly tokenService: TokenService) {}

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or missing refresh token' })
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token provided');

    // Validate and refresh tokens
    const tokens = await this.tokenService.refreshTokens(refreshToken);

    // Set new tokens in HttpOnly cookies
    setAuthCookies(res, tokens);

    return { message: 'Token refreshed' };
  }
}
