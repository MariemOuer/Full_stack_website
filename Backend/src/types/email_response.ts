import { Address } from 'nodemailer/lib/mailer';

export type EmailResponse = {
  successfulEmails: Array<string | Address>;
  failedEmails: Array<string | Address>;
  smtpResponse: string;
  messageId: string;
};
