import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../../../shared/decorators/public.decorator';

import { RequestPasswordResetDto } from '../dto/password-reset/request-password-reset.dto';
import { VerifyPasswordResetDto } from '../dto/password-reset/verify-password-reset.dto';
import { ResetPasswordDto } from '../dto/password-reset/reset-password.dto';

import { RequestPasswordResetService } from '../services/password-reset/request-password-reset.service';
import { VerifyPasswordResetService } from '../services/password-reset/verify-password-reset.service';
import { ResendPasswordResetService } from '../services/password-reset/resend-password-reset.service';
import { ConfirmPasswordResetService } from '../services/password-reset/confirm-password-reset.service';

@ApiTags('Auth')
@Controller('auth/password-reset')
export class PasswordResetController {
  constructor(
    private readonly requestResetService: RequestPasswordResetService,
    private readonly verifyResetService: VerifyPasswordResetService,
    private readonly resendResetService: ResendPasswordResetService,
    private readonly confirmResetService: ConfirmPasswordResetService,
  ) {}

  @Public()
  @Post('request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset code' })
  @ApiResponse({ status: 200, description: 'Reset code sent' })
  async request(@Body() dto: RequestPasswordResetDto) {
    return this.requestResetService.execute(dto);
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify password reset code' })
  @ApiResponse({ status: 200, description: 'Code verified' })
  async verify(@Body() dto: VerifyPasswordResetDto) {
    return this.verifyResetService.execute(dto);
  }

  @Public()
  @Post('resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend password reset code' })
  @ApiResponse({ status: 200, description: 'Reset code resent' })
  async resend(@Body() dto: RequestPasswordResetDto) {
    return this.resendResetService.execute(dto);
  }

  @Public()
  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm password reset (set new password)' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  async confirm(@Body() dto: ResetPasswordDto) {
    return this.confirmResetService.execute(dto);
  }
}