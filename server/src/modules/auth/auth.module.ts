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
// import { PasswordResetController } from './controllers/password-reset.controller';
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

// import { RequestPasswordResetService } from './services/password-reset/request-password-reset.service';
// import { VerifyPasswordResetService } from './services/password-reset/verify-password-reset.service';
// import { ResendPasswordResetService } from './services/password-reset/resend-password-reset.service';
// import { ConfirmPasswordResetService } from './services/password-reset/confirm-password-reset.service';

// ------------------------------------------------------
// -------------------- ENTITIES ------------------------
// ------------------------------------------------------
import { User, UserSchema } from 'src/database/entities/user.entity';
import {
  Throttle,
  ThrottleSchema,
} from 'src/database/entities/throttle.entity';
import { Account, AccountSchema } from 'src/database/entities/account.entity';
import { Session, SessionSchema } from 'src/database/entities/session.entity';
import { Verification, VerificationSchema } from 'src/database/entities/verification.entity';

// ------------------------------------------------------
// -------------------- MODULES -------------------------
// ------------------------------------------------------
import { MailModule } from 'src/modules/mail/mail.module';

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
    // PasswordResetController,
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
    // RequestPasswordResetService,
    // VerifyPasswordResetService,
    // ResendPasswordResetService,
    // ConfirmPasswordResetService,
  ],
  exports: [
    // Export what other modules might need
    TokenService,
    AuthThrottleService,
  ],
})
export class AuthModule { }
