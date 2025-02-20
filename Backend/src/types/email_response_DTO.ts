import { Address } from 'nodemailer/lib/mailer';

export type EmailResponseDTO = {
  successfulEmails: Array<string | Address>;
  failedEmails: Array<string | Address>;
  smtpResponse: string;
  messageId: string;
};
