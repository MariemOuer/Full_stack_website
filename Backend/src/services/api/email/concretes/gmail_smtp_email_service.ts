import nodemailer from 'nodemailer';
import { EmailService } from '../interfaces/email_service';
import { Result } from '@src/utils/result';
import { EmailResponse } from '@src/types/email_response';

const appPassword = process.env.GMAIL_APP_PASSWORD;
const occasioEmail = process.env.OCCASIO_EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: occasioEmail,
    pass: appPassword,
  },
});

class GmailSMTPEmailService implements EmailService {
  async sendEmails(recipientEmails: string[], content: string, inviteLink: string): Promise<Result<EmailResponse>> {
    try {
      const info = await transporter.sendMail({
        from: occasioEmail,
        to: recipientEmails,
        subject: "You're Invited!",
        html: content + '\n' + inviteLink,
      });

      const emailResponse: EmailResponse = {
        successfulEmails: info.accepted,
        failedEmails: info.rejected,
        smtpResponse: info.response,
        messageId: info.messageId,
      };

      return Result.ok(emailResponse);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
}

export default new GmailSMTPEmailService();
