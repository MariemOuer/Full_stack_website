import { Result } from '@src/utils/result';

export interface EmailService {
  sendInvitationEmail(senderEmail: string, recipientEmails: string[], content: string, inviteLink: string): Promise<Result<boolean>>;
}
