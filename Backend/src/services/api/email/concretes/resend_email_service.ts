import { Resend } from 'resend';
import { Result, Ok, Failure } from '@src/utils/result';

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  async sendInvitationEmail(senderEmail: string, recipientEmails: string[], content: string, inviteLink: string): Promise<Result<boolean>> {
    try {
      const response = await resend.emails.send({
        from: senderEmail,
        to: recipientEmails,
        subject: "You're Invited!",
        html: `
          <h1>You're Invited!</h1>
          <p>${content}</p>
          <p><a href="${inviteLink}" style="padding: 10px; background-color: blue; color: white; text-decoration: none;">Accept Invite</a></p>
        `,
      });

      return Ok(true);
    } catch (error) {
      return Failure(error as Error);
    }
  }
}

export default new EmailService();
