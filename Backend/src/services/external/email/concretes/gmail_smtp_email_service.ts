import nodemailer from 'nodemailer';
import { EmailService } from '../interfaces/email_service';
import { Result } from '@src/utils/result';
import { EmailResponseDTO } from '@src/types/email_response_DTO';

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
  async sendEmails(recipientEmails: string[], content: string, link?: string): Promise<Result<EmailResponseDTO>> {
    try {
      const formattedHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; background-color: #f9f9f9; border-radius: 8px;">
          <p style="font-size: 16px; color: #333;">${content}</p>
          ${
            link
              ? `<p style="text-align: center;">
                  <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                    Click Here to RSVP
                  </a>
                </p>`
              : ''
          }
          <p style="font-size: 14px; color: #777;">Looking forward to seeing you there!</p>
        </div>
      `;

      const info = await transporter.sendMail({
        from: occasioEmail,
        to: recipientEmails,
        subject: "You're Invited!",
        html: formattedHtml, // ✅ Properly formatted email
      });

      const emailResponse: EmailResponseDTO = {
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
