import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';

import { MeController } from './controllers/me.controller';
import { ProfileUpdateController } from './controllers/update-profile.controller';

import { GetCurrentUserService } from './services/me/get-current-user.service';
import { UpdateProfileService } from './services/update/update-profile.service';

import {
  User,
  UserSchema,
} from '../../infrastructure/database/entities/user.entity';

import {
  Enrollment,
  EnrollmentSchema,
} from '../../infrastructure/database/entities/enrollment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Enrollment.name,
        schema: EnrollmentSchema,
      },
    ]),

    AuthModule,
  ],

  controllers: [MeController, ProfileUpdateController],
  providers: [GetCurrentUserService, UpdateProfileService],
  exports: [GetCurrentUserService],
})
export class ProfileModule { }
