import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from '../../database/entities/class.entity';

import { CreateClassController } from './controllers/create-class.controller';
import { CreateClassService } from './services/create-class.services';

import { FetchClassesController } from './controllers/fetch-classes.controller';
import { FetchClassesService } from './services/fetch-classes.services';

import { JoinClassService } from './services/join-class.service';
import { JoinClassController } from './controllers/join-class.controller';
import { Enrollment, EnrollmentSchema } from '../../database/entities/enrollment.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
        MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    ],
    controllers: [CreateClassController, FetchClassesController, JoinClassController],
    providers: [CreateClassService, FetchClassesService, JoinClassService],
})
export class ClassModule { }
