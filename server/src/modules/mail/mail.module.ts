import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './services/mail.service';

/**
 * MailModule
 * Configures email sending functionality using @nestjs-modules/mailer
 * - Uses Gmail SMTP for sending emails
 * - Handlebars for HTML templates
 * - Templates stored in mail/templates/ directory
 */
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        // SMTP Transport Configuration
        transport: {
          host: ConfigService.get('mail.host'),
          port: ConfigService.get('mail.port'),
          secure: false,
          auth: {
            user: ConfigService.get('mail.user'),
            pass: ConfigService.get('mail.pass'), // Gmail App Password
          },
          tls: {
            rejectUnauthorized: false, // For development
          },
        },
        // Default sender information
        defaults: {
          from: `"${ConfigService.get('APP_NAME', 'ClassFlow-Prime')}" <${ConfigService.get('mail.user', 'classflow.support@gmail.com')}>`,
        },

        // Template configuration
        template: {
          dir: join(__dirname, 'templates'), // Template directory
          adapter: new HandlebarsAdapter(), // Template engine
          options: {
            strict: true,
          },
        },

        // Preview emails in browser during development
        preview: ConfigService.get('NODE_ENV') === 'development',
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
