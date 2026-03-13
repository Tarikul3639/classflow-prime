import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../../../shared/decorators/public.decorator';

import { SignUpDto } from '../dto/signup/signup.dto';
import { VerifySignupEmailDto } from '../dto/signup/verify-signup-email.dto';
import { ResendSignupVerificationDto } from '../dto/signup/resend-signup-verification.dto';

import { SignUpService } from '../services/signup/signup.service';
import { VerifySignupEmailService } from '../services/signup/verify-signup-email.service';
import { ResendSignupVerificationService } from '../services/signup/resend-signup-verification.service';

@ApiTags('Auth')
@Controller('auth/signup')
export class SignupController {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly verifySignupEmailService: VerifySignupEmailService,
    private readonly resendSignupVerificationService: ResendSignupVerificationService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Sign up (creates user + sends verification code)' })
  @ApiResponse({ status: 201, description: 'User created, code sent' })
  async signup(@Body() dto: SignUpDto) {
    return this.signUpService.execute(dto);
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify signup email code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  async verify(@Body() dto: VerifySignupEmailDto) {
    return this.verifySignupEmailService.execute(dto);
  }

  @Public()
  @Post('resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend signup verification code' })
  @ApiResponse({ status: 200, description: 'Verification code resent' })
  async resend(@Body() dto: ResendSignupVerificationDto) {
    return this.resendSignupVerificationService.execute(dto);
  }
}