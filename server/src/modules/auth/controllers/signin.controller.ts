import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
  async signin(@Body() dto: SignInDto) {
    return this.signInService.execute(dto);
  }
}