import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  });
  // Get config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT')!;
  const nodeEnv = configService.get<string>('NODE_ENV');

  // Security - Helmet
  app.use(helmet());

  // Compression
  app.use(compression());

  // Cookie Parser
  app.use(cookieParser());

  // CORS Configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN')!,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global Prefix
  app.setGlobalPrefix('api');

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2', // GET /v2/api/users     → version 2
  });

  // Global Pipes - Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Auto convert types
      },
    }),
  );

  // Swagger API Documentation (only in development)
  if (nodeEnv === 'development') {
    const config = new DocumentBuilder()
      .setTitle('NestJS API Documentation')
      .setDescription('Complete API documentation for the NestJS application')
      .setVersion('2.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag(
        'Auth',
        'Authentication endpoints (signup, signin, forgot password)',
      )
      .addTag('Users', 'User management endpoints')
      .addTag('Dashboard', 'Dashboard statistics endpoints')
      .addTag('Classes', 'Class management endpoints')
      .addTag('Notifications', 'Notification endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // Persist auth token across page refreshes
      },
    });

    console.log(`📚 Swagger Documentation: http://localhost:${port}/api/docs`);
  }
  // Graceful Shutdown
  app.enableShutdownHooks();

  // Start Server
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`🌍 Environment: ${nodeEnv}`);
}

bootstrap();
