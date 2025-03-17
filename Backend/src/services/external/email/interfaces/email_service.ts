import { EmailResponseDTO } from "../../../../types/email_response_DTO";
import { Result } from "../../../../utils/result/result";



export interface EmailService {
  sendEmails(recipientEmails: string[], content: string, link?: String): Promise<Result<EmailResponseDTO>>;
}
