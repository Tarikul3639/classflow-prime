import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

/**
 * MailService
 * Handles all email sending operations:
 * - Email verification (6-digit code)
 * - Password reset
 * - Welcome emails
 * - Password change notifications
 */
@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly frontendUrl: string;
    private readonly appName: string;
    private readonly expiresInMinutes: number;

    constructor(
        private mailerService: MailerService,
        private configService: ConfigService,
    ) {
        this.frontendUrl = this.configService.get(
            'FRONTEND_URL',
            'http://localhost:3000',
        );
        this.appName = this.configService.get('APP_NAME', 'ClassFlow Prime');
        this.expiresInMinutes = parseInt(
            this.configService.get('MAIL_EXPIRES_IN', '15'),
            10,
        );
    }

    /**
     * Send email verification code (6 digits)
     * Called after user registration
     */
    async sendVerificationEmail(
        email: string,
        name: string,
        code: string,
    ): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `Your Verification Code - ${this.appName}`,
                template: 'verification',
                context: {
                    name,
                    code,
                    appName: this.appName,
                    expirationMinutes: this.expiresInMinutes,
                    year: new Date().getFullYear(),
                },
            });
            this.logger.log(`✅ Verification email sent to ${email} (Code: ${code})`);
        } catch (error) {
            this.logger.error(
                `❌ Failed to send verification email to ${email}: ${error.message}`,
            );
            throw new Error('Failed to send verification email');
        }
    }

    /**
     * Send welcome email after successful email verification
     */
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        const dashboardUrl = `${this.frontendUrl}/dashboard`;
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `Welcome to ${this.appName}!`,
                template: 'welcome',
                context: {
                    name,
                    dashboardUrl,
                    appName: this.appName,
                    year: new Date().getFullYear(),
                },
            });
            this.logger.log(`✅ Welcome email sent to ${email}`);
        } catch (error) {
            this.logger.error(
                `❌ Failed to send welcome email to ${email}: ${error.message}`,
            );
            // Don't throw - welcome email failure shouldn't break the flow
        }
    }

    /**
     * Send password reset code (6 digits)
     */
    async sendPasswordResetEmail(
        email: string,
        name: string,
        code: string,
    ): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `Your Password Reset Code - ${this.appName}`,
                template: 'password-reset',
                context: {
                    name,
                    code,
                    appName: this.appName,
                    expirationMinutes: this.expiresInMinutes,
                    year: new Date().getFullYear(),
                },
            });
            this.logger.log(
                `✅ Password reset email sent to ${email} (Code: ${code})`,
            );
        } catch (error) {
            this.logger.error(
                `❌ Failed to send password reset email to ${email}: ${error.message}`,
            );
            throw new Error('Failed to send password reset email');
        }
    }

    /**
     * Send password changed confirmation email
     */
    async sendPasswordChangedEmail(email: string, name: string): Promise<void> {
        const supportUrl = `${this.frontendUrl}/support`;
        const signinUrl = `${this.frontendUrl}/signin`;

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `Your Password Has Been Changed - ${this.appName}`,
                template: 'password-changed',
                context: {
                    name,
                    appName: this.appName,
                    supportUrl,
                    signinUrl,
                    changedAt: new Date().toLocaleString('en-US', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                    }),
                    year: new Date().getFullYear(),
                },
            });
            this.logger.log(`✅ Password changed email sent to ${email}`);
        } catch (error) {
            this.logger.error(
                `❌ Failed to send password changed email to ${email}: ${error.message}`,
            );
            // Don't throw - confirmation email failure shouldn't break the flow
        }
    }

    /**
     * Send generic email (for custom use cases)
     */
    async sendEmail(
        to: string,
        subject: string,
        template: string,
        context: Record<string, any>,
    ): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to,
                subject,
                template,
                context: {
                    ...context,
                    appName: this.appName,
                    year: new Date().getFullYear(),
                },
            });
            this.logger.log(`✅ Email sent to ${to} (template: ${template})`);
        } catch (error) {
            this.logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
            throw new Error('Failed to send email');
        }
    }
}