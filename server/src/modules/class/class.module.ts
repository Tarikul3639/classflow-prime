import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from '../../database/entities/class.entity';
import {
  Enrollment,
  EnrollmentSchema,
} from '../../database/entities/enrollment.entity';
import { ClassUpdate, ClassUpdateSchema } from '../../database/entities/update.entity';
import { Material, MaterialSchema } from '../../database/entities/material.entity';

import { CreateClassController } from './controllers/create-class.controller';
import { CreateClassService } from './services/create-class.service';

import { FetchClassesController } from './controllers/fetch-enrolled-classes.controller';
import { FetchEnrolledClassesService } from './services/fetch-enrolled-classes.service';

import { EnrollClassService } from './services/enroll-class.service';
import { EnrollClassController } from './controllers/enroll-class.controller';


import { FetchClassController } from './controllers/fetch-class.controller';
import { FetchClassService } from './services/fetch-class.service';

import { FetchClassOverviewController } from './controllers/fetch-class-overview.controller';
import { FetchClassOverviewService } from './services/fetch-class-overview.service';

import { FetchClassUpdateController } from './controllers/fetch-class-update.controller';
import { FetchClassUpdateService } from './services/fetch-class-update.service';

import { CreateClassUpdateController } from './controllers/create-class-update.controller';
import { CreateClassUpdateService } from './services/create-class-update.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
    MongooseModule.forFeature([
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
    MongooseModule.forFeature([{ name: ClassUpdate.name, schema: ClassUpdateSchema }]),
    MongooseModule.forFeature([{ name: Material.name, schema: MaterialSchema }]),
  ],
  controllers: [
    CreateClassController,
    FetchClassesController,
    EnrollClassController,
    FetchClassController,
    FetchClassOverviewController,
    FetchClassUpdateController,
    CreateClassUpdateController,
  ],
  providers: [
    CreateClassService,
    FetchEnrolledClassesService,
    EnrollClassService,
    FetchClassService,
    FetchClassOverviewService,
    FetchClassUpdateService,
    CreateClassUpdateService,
  ],
})
export class ClassModule { }
