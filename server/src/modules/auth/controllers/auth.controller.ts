import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { SignInDto } from '../dto/signin.dto';
import { SignUpDto } from '../dto/signup.dto';
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { Public } from 'src/shared/decorators/public.decorator'; // Custom decorator to mark routes as public

/**
 * AuthController
 * Handles authentication endpoints:
 * - User registration (signup)
 * - User login (signin)
 * - Email verification
 * - Resend verification code
 * - Get current user
 * - Logout
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // ==================== SIGNUP ====================

    /**
     * Register a new user account
     * Sends a 6-digit verification code to the user's email
     */

    @Public() // Custom decorator to mark this route as public (no auth required)
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Register a new user',
        description:
            'Creates a new user account and sends a 6-digit verification code via email. The code expires in 15 minutes.',
    })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully. Verification code sent to email.',
        schema: {
            example: {
                message:
                    'Registration successful. Please check your email for a 6-digit verification code.',
                user: {
                    _id: '507f1f77bcf86cd799439011',
                    email: 'john.doe@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    username: 'john_doe',
                    role: 'student',
                    status: 'pending_verification',
                    isEmailVerified: false,
                    isActive: true,
                    createdAt: '2024-01-15T10:30:00.000Z',
                    updatedAt: '2024-01-15T10:30:00.000Z',
                },
                tokens: {
                    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    expiresIn: '1d',
                },
            },
        },
    })
    @ApiResponse({
        status: 409,
        description: 'User with this email already exists',
    })
    @ApiResponse({
        status: 400,
        description: 'Validation failed',
    })
    async signup(@Body() signupDto: SignUpDto) {
        return this.authService.signUp(signupDto);
    }
}

