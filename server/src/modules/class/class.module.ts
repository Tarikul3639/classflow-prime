import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from '../../database/entities/class.entity';

import { CreateClassController } from './controllers/create-class.controller';
import { CreateClassService } from './services/create-class.service';

import { FetchClassesController } from './controllers/fetch-enrolled-classes.controller';
import { FetchEnrolledClassesService } from './services/fetch-enrolled-classes.service';

import { EnrollClassService } from './services/enroll-class.service';
import { EnrollClassController } from './controllers/enroll-class.controller';
import {
  Enrollment,
  EnrollmentSchema,
} from '../../database/entities/enrollment.entity';

import { FetchClassController } from './controllers/fetch-class.controller';
import { FetchClassService } from './services/fetch-class.service';

import { FetchClassOverviewController } from './controllers/fetch-class-overview.controller';
import { FetchClassOverviewService } from './services/fetch-class-overview.service';

import { FetchClassUpdateController } from './controllers/fetch-class-update.controller';
import { FetchClassUpdateService } from './services/fetch-class-update.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
    MongooseModule.forFeature([
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
  ],
  controllers: [
    CreateClassController,
    FetchClassesController,
    EnrollClassController,
    FetchClassController,
    FetchClassOverviewController,
    FetchClassUpdateController,
  ],
  providers: [
    CreateClassService,
    FetchEnrolledClassesService,
    EnrollClassService,
    FetchClassService,
    FetchClassOverviewService,
    FetchClassUpdateService,
  ],
})
export class ClassModule { }
