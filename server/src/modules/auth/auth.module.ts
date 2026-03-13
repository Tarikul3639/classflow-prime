import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// -----------------------------------------------------
// -------------------- CONTROLLERS --------------------
// -----------------------------------------------------
import { AuthController } from './controllers/auth.controller';
import { PasswordController } from './controllers/password.controller';

// --------------------------------------------------
// -------------------- SERVICES --------------------
// --------------------------------------------------

// Main orchestrator service
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';

// Authentication related services
import { SignUpService } from './services/signup.service';
import { SignInService } from './services/signin.service';
import { SignOutService } from './services/signout.service';

// User validation and retrieval
import { CurrentUserService } from './services/current-user.service';
import { ValidateUserService } from './services/validate-user.service';

// Email and verification
import { VerifyEmailService } from './services/verify-email.service';
import { ResendVerificationService } from './services/resend-verification.service';
import { UserSanitizerService } from './services/user-sanitizer.service';
import { TokenService } from './services/token.service';

// ------------------------------------------------------
// -------------------- ENTITIES ------------------------
// ------------------------------------------------------
import { User, UserSchema } from 'src/database/entities/user.entity';

// ------------------------------------------------------
// -------------------- MODULE DEFINITION ----------------
// ------------------------------------------------------
import { MailModule } from 'src/modules/mail/mail.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
    controllers: [AuthController, PasswordController],
    providers: [
        AuthService,
        PasswordService,
        
        SignUpService,
        SignInService,
        VerifyEmailService,
        ResendVerificationService,
        UserSanitizerService,
        TokenService,
        SignOutService,
        CurrentUserService,
        ValidateUserService,

        JwtStrategy,
        LocalStrategy,
        JwtRefreshStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule { }
