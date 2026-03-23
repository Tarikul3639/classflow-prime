import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from '../../database/entities/class.entity';

import { CreateClassController } from './controllers/create-class.controller';
import { CreateClassService } from './services/create-class.service';

import { FetchClassesController } from './controllers/fetch-enrolled-classes.controller';
import { FetchClassesService } from './services/fetch-enrolled-classes.service';

import { EnrollClassService } from './services/enroll-class.service';
import { EnrollClassController } from './controllers/enroll-class.controller';
import { Enrollment, EnrollmentSchema } from '../../database/entities/enrollment.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
        MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    ],
    controllers: [CreateClassController, FetchClassesController, EnrollClassController],
    providers: [CreateClassService, FetchClassesService, EnrollClassService],
})
export class ClassModule { }
