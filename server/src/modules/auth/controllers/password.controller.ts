import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { PasswordService } from '../services/password.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { VerifyResetCodeDto } from '../dto/verify-reset-code.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { Public } from '../../../shared/decorators/public.decorator';

/**
 * PasswordController
 * Handles password reset operations
 */
@ApiTags('Password Management')
@Controller('auth')
export class PasswordController {
    constructor(private readonly passwordService: PasswordService) { }

    // ==================== FORGOT PASSWORD (Send OTP) ====================

    @Public()
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Request password reset',
        description: 'Sends a 6-digit OTP to user\'s email for password reset',
    })
    @ApiResponse({
        status: 200,
        description: 'Reset code sent successfully',
        schema: {
            example: {
                message: 'Password reset code sent to your email',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.passwordService.sendPasswordResetCode(forgotPasswordDto);
    }

    // ==================== VERIFY RESET CODE ====================

    @Public()
    @Post('forgot-password/verify-otp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verify password reset code',
        description: 'Verifies the 6-digit OTP sent to user\'s email',
    })
    @ApiResponse({
        status: 200,
        description: 'Code verified successfully',
        schema: {
            example: {
                message: 'Code verified successfully',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid or expired code',
    })
    async verifyResetCode(@Body() verifyResetCodeDto: VerifyResetCodeDto) {
        return this.passwordService.verifyPasswordResetCode(verifyResetCodeDto);
    }

    // ==================== RESET PASSWORD ====================

    @Public()
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Reset password',
        description: 'Resets user password using verified code',
    })
    @ApiResponse({
        status: 200,
        description: 'Password reset successfully',
        schema: {
            example: {
                message: 'Password reset successfully',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid or expired code',
    })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.passwordService.resetPassword(resetPasswordDto);
    }
}