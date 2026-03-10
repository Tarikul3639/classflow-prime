import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configs], // Load configuration from app.config.ts
      isGlobal: true, // Make ConfigModule available globally
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
