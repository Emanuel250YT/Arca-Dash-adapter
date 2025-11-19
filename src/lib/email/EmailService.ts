import { resend, defaultEmailConfig } from '@/lib/resend';
import {
  ResetPasswordEmailTemplate,
  ResetPasswordEmailText
} from '@/templates/email/ResetPasswordEmail';
import {
  WelcomeEmailTemplate,
  WelcomeEmailText
} from '@/templates/email/WelcomeEmail';
import {
  EmailVerificationTemplate,
  EmailVerificationText
} from '@/templates/email/EmailVerificationEmail';

interface BaseEmailOptions {
  to: string;
  subject?: string;
}

interface ResetPasswordEmailOptions extends BaseEmailOptions {
  userName: string;
  resetUrl: string;
  expirationTime?: string;
}

interface WelcomeEmailOptions extends BaseEmailOptions {
  userName: string;
  userEmail: string;
  loginUrl?: string;
  isEmailVerificationRequired?: boolean;
  verificationUrl?: string;
}

interface EmailVerificationOptions extends BaseEmailOptions {
  userName: string;
  verificationUrl: string;
  expirationTime?: string;
}

function sanitizeTagValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 256);
}

export class EmailService {

  static async sendResetPasswordEmail({
    to,
    subject = "Restablecimiento de contraseña - Anahí Gobbi",
    userName,
    resetUrl,
    expirationTime
  }: ResetPasswordEmailOptions) {
    try {
      const htmlContent = ResetPasswordEmailTemplate({
        userName,
        resetUrl,
        expirationTime
      });

      const textContent = ResetPasswordEmailText({
        userName,
        resetUrl,
        expirationTime
      });

      const response = await resend.emails.send({
        from: defaultEmailConfig.from,
        to,
        subject,
        html: htmlContent,
        text: textContent,
        replyTo: defaultEmailConfig.replyTo,
        tags: [
          { name: 'category', value: 'password_reset' },
          { name: 'user_name', value: sanitizeTagValue(userName) }
        ]
      });

      if (response.error) {
        return {
          success: false,
          error: `Resend error: ${response.error.message || 'Unknown error'}`
        };
      }

      return { success: true, id: response.data?.id };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async sendWelcomeEmail({
    to,
    subject = "Bienvenido/a a Anahí Gobbi",
    userName,
    userEmail,
    loginUrl,
    isEmailVerificationRequired,
    verificationUrl
  }: WelcomeEmailOptions) {
    try {
      const htmlContent = WelcomeEmailTemplate({
        userName,
        userEmail,
        loginUrl,
        isEmailVerificationRequired,
        verificationUrl
      });

      const textContent = WelcomeEmailText({
        userName,
        userEmail,
        loginUrl,
        isEmailVerificationRequired,
        verificationUrl
      });

      const response = await resend.emails.send({
        from: defaultEmailConfig.from,
        to,
        subject,
        html: htmlContent,
        text: textContent,
        replyTo: defaultEmailConfig.replyTo,
        tags: [
          { name: 'category', value: 'welcome' },
          { name: 'user_name', value: sanitizeTagValue(userName) },
          { name: 'verification_required', value: isEmailVerificationRequired ? 'true' : 'false' }
        ]
      });

      if (response.error) {
        return {
          success: false,
          error: `Resend error: ${response.error.message || 'Unknown error'}`
        };
      }

      return { success: true, id: response.data?.id };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async sendEmailVerification({
    to,
    subject = "Verificación de correo electrónico - Anahí Gobbi",
    userName,
    verificationUrl,
    expirationTime
  }: EmailVerificationOptions) {
    try {
      const htmlContent = EmailVerificationTemplate({
        userName,
        verificationUrl,
        expirationTime
      });

      const textContent = EmailVerificationText({
        userName,
        verificationUrl,
        expirationTime
      });

      const response = await resend.emails.send({
        from: defaultEmailConfig.from,
        to,
        subject,
        html: htmlContent,
        text: textContent,
        replyTo: defaultEmailConfig.replyTo,
        tags: [
          { name: 'category', value: 'email_verification' },
          { name: 'user_name', value: sanitizeTagValue(userName) }
        ]
      });

      if (response.error) {
        return {
          success: false,
          error: `Resend error: ${response.error.message || 'Unknown error'}`
        };
      }

      return { success: true, id: response.data?.id };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async sendCustomEmail({
    to,
    subject,
    html,
    text,
    tags = []
  }: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    tags?: Array<{ name: string; value: string }>;
  }) {
    try {
      const response = await resend.emails.send({
        from: defaultEmailConfig.from,
        to,
        subject,
        html,
        text,
        replyTo: defaultEmailConfig.replyTo,
        tags: [
          { name: 'category', value: 'custom' },
          ...tags.map(tag => ({
            name: sanitizeTagValue(tag.name),
            value: sanitizeTagValue(tag.value)
          }))
        ]
      });

      if (response.error) {
        return {
          success: false,
          error: `Resend error: ${response.error.message || 'Unknown error'}`
        };
      }

      return { success: true, id: response.data?.id };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}