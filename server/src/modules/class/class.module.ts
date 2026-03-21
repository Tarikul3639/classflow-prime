import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/database/entities/class.entity';

import { CreateClassController } from './controllers/create-class.controller';
import { CreateClassService } from './services/create-class.services';

import { FetchClassesController } from './controllers/fetch-classes.controller';
import { FetchClassesService } from './services/fetch-classes.services';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
    ],
    controllers: [CreateClassController, FetchClassesController],
    providers: [CreateClassService, FetchClassesService],
})
export class ClassModule { }
