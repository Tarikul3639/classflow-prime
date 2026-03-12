import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import e from 'express';

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
        this.appName = this.configService.get('APP_NAME', 'ClassFlow-Prime');
        this.expiresInMinutes = parseInt(
            this.configService.get('mail.expiresIn', '15'),
            10,
        );
    }

    /**
     * Send email verification code (6 digits)
     * Called after user registration
     *
     * @param email - User's email address
     * @param name - User's first name
     * @param code - 6-digit verification code
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
                    code, // Send 6-digit code
                    appName: this.appName,
                    expirationMinutes: this.expiresInMinutes, // Code expires in configured minutes
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
     *
     * @param email - User's email address
     * @param name - User's first name
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
                },
            });
            this.logger.log(`✅ Welcome email sent to ${email}`);
        } catch (error) {
            this.logger.error(
                `❌ Failed to send welcome email to ${email}: ${error.message}`,
            );
            throw new Error('Failed to send welcome email');
        }
    }

    /**
     * Send password reset code (6 digits)
     * Called when user requests password reset
     *
     * @param email - User's email address
     * @param name - User's first name
     * @param code - 6-digit password reset code
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
                    code, // Send 6-digit code
                    appName: this.appName,
                    expirationMinutes: 15,
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
     * Called after successful password change/reset
     *
     * @param email - User's email address
     * @param name - User's first name
     */
    async sendPasswordChangedEmail(email: string, name: string): Promise<void> {
        const supportUrl = `${this.frontendUrl}/support`;

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `Your Password Has Been Changed - ${this.appName}`,
                template: '../templates/password-changed.hbs',
                context: {
                    name,
                    appName: this.appName,
                    supportUrl,
                    changedAt: new Date().toLocaleString('en-US', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                    }),
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
     *
     * @param to - Recipient email
     * @param subject - Email subject
     * @param template - Template name (without .hbs extension)
     * @param context - Template variables
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
                template: `../templates/${template}.hbs`,
                context: {
                    ...context,
                    appName: this.appName,
                },
            });

            this.logger.log(`✅ Email sent to ${to} (template: ${template})`);
        } catch (error) {
            this.logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
            throw new Error('Failed to send email');
        }
    }
}

export class MailModule {}
