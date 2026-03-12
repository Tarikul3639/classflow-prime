import { Injectable } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Entity:: User model and document interface
import { User, UserDocument } from '../../../database/entities/user.entity';

// DTO::Data Transfer Objects for request validation
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';

// Interface:: Response interfaces for type safety
import {
  ISignUpResponse,
  ISignInResponse,
  IVerifyEmailResponse,
  IResendVerificationResponse,
  ISignOutResponse,
  ICurrentUserResponse,
} from '../interfaces/auth.interface';

// Service:: Core auth services delegated by AuthService
import { SignUpService } from './signup.service';
import { SignInService } from './signin.service';
import { SignOutService } from './signout.service';

import { VerifyEmailService } from './verify-email.service';
import { ResendVerificationService } from './resend-verification.service';

import { ValidateUserService } from './validate-user.service';
import { CurrentUserService } from './current-user.service';

/**
 * AuthService (Main Orchestrator)
 * Delegates to specialized services
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private signupService: SignUpService,
    private signinService: SignInService,
    private verifyEmailService: VerifyEmailService,
    private resendVerificationService: ResendVerificationService,
    private currentUserService: CurrentUserService,
    private validateUserService: ValidateUserService,
  ) { }

  // Delegate to SignUpService
  async signUp(signUpDto: SignUpDto): Promise<ISignUpResponse> {
    return this.signupService.execute(signUpDto);
  }

  // Delegate to SignInService
  async signIn(signInDto: SignInDto): Promise<ISignInResponse> {
    return this.signinService.execute(signInDto);
  }

  // Delegate to VerifyEmailService
  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<IVerifyEmailResponse> {
    return this.verifyEmailService.execute(verifyEmailDto);
  }

  // Delegate to ResendVerificationService
  async resendVerificationEmail(
    resendDto: ResendVerificationDto,
  ): Promise<IResendVerificationResponse> {
    return this.resendVerificationService.execute(resendDto);
  }

  // Delegate to SignOutService
  async signOut(
    userId: string,
    refreshToken?: string,
  ): Promise<ISignOutResponse> {
    const signOutService = new SignOutService(this.userModel);
    return signOutService.execute(userId, refreshToken);
  }

  async getCurrentUser(userId: string): Promise<ICurrentUserResponse> {
    return this.currentUserService.execute(userId);
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    return this.validateUserService.execute(email, password);
  }
}