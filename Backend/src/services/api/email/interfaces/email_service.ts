import { EmailResponse } from '@src/types/email_response';
import { Result } from '@src/utils/result';

export interface EmailService {
  sendEmails(recipientEmails: string[], content: string, inviteLink: string): Promise<Result<EmailResponse>>;
}
