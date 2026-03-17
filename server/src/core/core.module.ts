import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { LoggerMiddleware } from './middleware/logger.middleware';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule, JwtModule.register({})],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // global logger
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
