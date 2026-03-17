import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Headers,
  Post,
  Req,
  Res,
  Ip,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../../../shared/decorators/public.decorator';
import { setAuthCookies } from '../../../shared/utils/auth-cookies.util';

import { SignInDto } from '../dto/signin/signin.dto';
import { SignInService } from '../services/signin/signin.service';

@ApiTags('Auth')
@Controller('auth/signin')
export class SigninController {
  constructor(private readonly signInService: SignInService) { }

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'Signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signin(
    @Body() dto: SignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    // Prefer x-forwarded-for when behind proxy, else req.ip
    const realIp =
      (req.headers['x-forwarded-for'] as string | undefined)
        ?.split(',')[0]
        ?.trim() ||
      req.ip ||
      ip;

    // Call the service to perform sign-in logic
    const result = await this.signInService.execute(dto, {
      ip: realIp,
      userAgent: ua || 'unknown-device',
    });

    // set HttpOnly cookies here (HTTP layer concern)
    setAuthCookies(res, result.tokens);

    // Optional: tokens removed from response body since they are in cookies, but can be included if needed by frontend
    return {
      message: result.message,
      user: result.user,
    };
  }
}
