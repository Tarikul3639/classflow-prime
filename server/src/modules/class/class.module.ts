import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/database/entities/class.entity';

import { CreateClassController } from './controllers/create-class.controller';
import { CreateClassService } from './services/create-class.services';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
    ],
    controllers: [CreateClassController],
    providers: [CreateClassService],
})
export class ClassModule { }
