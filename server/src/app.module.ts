import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from './config';

// Import the DatabaseModule
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
// import { SeedModule } from './database/seeds/seed.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs, // Load all configuration factories from config/index.ts
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: ['src/.env', '.env'], // Load .env files
    }),
    DatabaseModule,
    AuthModule,
    // SeedModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
