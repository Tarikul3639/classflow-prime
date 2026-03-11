import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from '../entities/user.entity';
import { UserSeeder } from './user.seed';
import { DatabaseSeeder } from './user-seed.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UserSeeder, DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class SeedModule {}