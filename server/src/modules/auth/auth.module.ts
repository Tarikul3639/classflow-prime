import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

// -----------------------------------------------------
// -------------------- CONTROLLERS --------------------
// -----------------------------------------------------
import { SigninController } from './controllers/signin.controller';
import { SignoutController } from './controllers/signout.controller';
import { SignupController } from './controllers/signup.controller';
import { PasswordResetController } from './controllers/password-reset.controller';
import { DebugController } from './controllers/debug.controller';

// --------------------------------------------------
// -------------------- SERVICES --------------------
// --------------------------------------------------

// Reusable helpers
import { TokenService } from './services/token/token.service';
import { AuthThrottleService } from './services/throttle/auth-throttle.service';

// Feature services
import { SignInService } from './services/signin/signin.service';
import { SignOutService } from './services/signout/signout.service';

import { SignUpService } from './services/signup/signup.service';
import { VerifySignupEmailService } from './services/signup/verify-signup-email.service';
import { ResendSignupVerificationService } from './services/signup/resend-signup-verification.service';

// Password reset flow
import { RequestService } from './services/password-reset/request.service';
import { ResendOtpService } from './services/password-reset/resend-otp.service';
import { VerifyOtpService } from './services/password-reset/verify-otp.service';
import { ResetPasswordService } from './services/password-reset/reset-password.service';

// ------------------------------------------------------
// -------------------- ENTITIES ------------------------
// ------------------------------------------------------
import { User, UserSchema } from '../../database/entities/user.entity';
import {
  Throttle,
  ThrottleSchema,
} from '../../database/entities/throttle.entity';
import { Account, AccountSchema } from '../../database/entities/account.entity';
import { Session, SessionSchema } from '../../database/entities/session.entity';
import {
  Verification,
  VerificationSchema,
} from '../../database/entities/verification.entity';

// ------------------------------------------------------
// -------------------- MODULES -------------------------
// ------------------------------------------------------
import { MailModule } from '../../modules/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Throttle.name, schema: ThrottleSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Verification.name, schema: VerificationSchema },
    ]),
    MailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<StringValue>('jwt.accessToken.secret'),
      }),
    }),
  ],
  controllers: [
    // core auth
    SigninController,
    SignoutController,
    DebugController,

    // feature groups
    SignupController,
    PasswordResetController,
  ],
  providers: [
    // reusable core helpers
    TokenService,
    AuthThrottleService,

    // core auth features
    SignInService,
    SignOutService,

    // signup flow
    SignUpService,
    VerifySignupEmailService,
    ResendSignupVerificationService,

    // password reset flow
    RequestService,
    ResendOtpService,
    VerifyOtpService,
    ResetPasswordService,
  ],
  exports: [
    // Export what other modules might need
    TokenService,
    AuthThrottleService,
  ],
})
export class AuthModule {}
