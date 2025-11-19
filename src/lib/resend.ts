import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración por defecto
export const defaultEmailConfig = {
  from: process.env.FROM_EMAIL || 'noreply@anahigobbi.com',
  replyTo: process.env.REPLY_TO_EMAIL || 'support@anahigobbi.com',
};
