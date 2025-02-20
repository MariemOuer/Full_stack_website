import { EmailResponseDTO } from '@src/types/email_response_DTO';
import { Result } from '@src/utils/result';

export interface EmailService {
  sendEmails(recipientEmails: string[], content: string, link?: String): Promise<Result<EmailResponseDTO>>;
}
