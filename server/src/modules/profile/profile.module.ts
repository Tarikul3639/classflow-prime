import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Auth module is imported to leverage its services and guards for authentication
import { AuthModule } from '../auth/auth.module';

import { MeController } from './controllers/me.controller';
import { GetCurrentUserService } from './services/me/get-current-user.service';
import { User, UserSchema } from 'src/database/entities/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        AuthModule, // Import AuthModule to use its services and guards
    ],
    controllers: [MeController],
    providers: [GetCurrentUserService],
    exports: [GetCurrentUserService], // Export if other modules need to use it
})
export class ProfileModule { }