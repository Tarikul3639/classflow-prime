import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Ip,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../../../shared/decorators/public.decorator';
import { SignInDto } from '../dto/signin/signin.dto';
import { SignInService } from '../services/signin/signin.service';

@ApiTags('Auth')
@Controller('auth/signin')
export class SigninController {
  constructor(private readonly signInService: SignInService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'Signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signin(@Body() dto: SignInDto, @Req() req: Request, @Ip() ip: string) {
    // Prefer x-forwarded-for when behind proxy, else req.ip
    const realIp =
      (req.headers['x-forwarded-for'] as string | undefined)
        ?.split(',')[0]
        ?.trim() ||
      req.ip ||
      ip;

    const userAgent = req.headers['user-agent'] ?? '';

    return this.signInService.execute(dto, { ip: realIp, userAgent });
  }
}