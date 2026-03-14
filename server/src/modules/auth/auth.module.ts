import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// -----------------------------------------------------
// -------------------- CONTROLLERS --------------------
// -----------------------------------------------------
import { SigninController } from './controllers/signin.controller';
import { MeController } from './controllers/me.controller';
import { SignoutController } from './controllers/signout.controller';
import { SignupController } from './controllers/signup.controller';
import { PasswordResetController } from './controllers/password-reset.controller';

// --------------------------------------------------
// -------------------- SERVICES --------------------
// --------------------------------------------------

// Reusable helpers
import { TokenService } from './services/token/token.service';
import { UserSanitizerService } from './services/sanitizer/user-sanitizer.service';
import { AuthThrottleService } from './services/throttle/auth-throttle.service';

// Feature services
import { SignInService } from './services/signin/signin.service';
import { GetCurrentUserService } from './services/me/get-current-user.service';
import { SignOutService } from './services/signout/signout.service';

import { SignUpService } from './services/signup/signup.service';
import { VerifySignupEmailService } from './services/signup/verify-signup-email.service';
import { ResendSignupVerificationService } from './services/signup/resend-signup-verification.service';

import { RequestPasswordResetService } from './services/password-reset/request-password-reset.service';
import { VerifyPasswordResetService } from './services/password-reset/verify-password-reset.service';
import { ResendPasswordResetService } from './services/password-reset/resend-password-reset.service';
import { ConfirmPasswordResetService } from './services/password-reset/confirm-password-reset.service';

import { ValidateUserService } from './services/users/validate-user.service';

// ------------------------------------------------------
// -------------------- ENTITIES ------------------------
// ------------------------------------------------------
import { User, UserSchema } from 'src/database/entities/user.entity';
import { AuthThrottle, AuthThrottleSchema } from 'src/database/entities/auth-throttle.entity';

// ------------------------------------------------------
// -------------------- MODULES -------------------------
// ------------------------------------------------------
import { MailModule } from 'src/modules/mail/mail.module';

// ------------------------------------------------------
// -------------------- STRATEGIES ----------------------
// ------------------------------------------------------
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthThrottle.name, schema: AuthThrottleSchema },
    ]),
    MailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessToken.secret'),
        signOptions: {
          expiresIn: parseInt(
            configService.get<string>('jwt.accessToken.expiresIn', '3600'),
            10,
          ),
        },
      }),
    }),
  ],
  controllers: [
    // core auth
    SigninController,
    MeController,
    SignoutController,

    // feature groups
    SignupController,
    PasswordResetController,
  ],
  providers: [
    // reusable core helpers
    TokenService,
    UserSanitizerService,
    AuthThrottleService,

    // core auth features
    SignInService,
    GetCurrentUserService,
    SignOutService,

    // signup flow
    SignUpService,
    VerifySignupEmailService,
    ResendSignupVerificationService,

    // password reset flow
    RequestPasswordResetService,
    VerifyPasswordResetService,
    ResendPasswordResetService,
    ConfirmPasswordResetService,

    // strategies (if you are still using them)
    JwtStrategy,
    LocalStrategy,
    JwtRefreshStrategy,

    // user validation (used by strategies)
    ValidateUserService,
  ],
  exports: [
    // Export what other modules might need
    TokenService,
    UserSanitizerService,
    AuthThrottleService,
  ],
})
export class AuthModule {}