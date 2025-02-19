import { ItineraryRepository } from '@src/repositories/interfaces/itinerary_repository';
import { EmailService } from './api/email/interfaces/email_service';
import { Result } from '@src/utils/result';
import standardOccasioEmail from '../utils/constants/standard_invite';

export class ItineraryService {
  private itineraryRepository: ItineraryRepository;
  private emailService: EmailService;

  constructor(itineraryRepository: ItineraryRepository, emailService: EmailService) {
    this.itineraryRepository = itineraryRepository;
    this.emailService = emailService;
  }

  async inviteGuests(senderEmail: string, guestEmails: string[], eventKey: string): Promise<Result<boolean>> {
    const inviteLink = 'events/invite/' + eventKey;
    return await this.emailService.sendInvitationEmail(senderEmail, guestEmails, standardOccasioEmail, inviteLink);
  }
}
