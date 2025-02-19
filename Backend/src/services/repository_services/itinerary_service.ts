import { ItineraryRepository } from '@src/repositories/interfaces/itinerary_repository';
import { EmailService } from '../api/email/interfaces/email_service';
import { Result } from '@src/utils/result';
import standardOccasioEmail from '../../utils/constants/standard_invite';
import { Itinerary } from '@prisma/client';

export class ItineraryService {
  private itineraryRepository: ItineraryRepository;
  private emailService: EmailService;

  constructor({ itineraryRepository, emailService }: { itineraryRepository: ItineraryRepository; emailService: EmailService }) {
    this.itineraryRepository = itineraryRepository;
    this.emailService = emailService;
  }

  async inviteGuests(senderEmail: string, guestEmails: string[], eventKey: string): Promise<Result<boolean>> {
    const inviteURI = 'events/invite/' + eventKey;
    return await this.emailService.sendInvitationEmail(senderEmail, guestEmails, standardOccasioEmail, inviteURI);
  }

  async fetchAllCreatedItinerariesFromUser(userId: number): Promise<Result<Itinerary[]>> {
    return await this.itineraryRepository.getAllCreatedItinerariesForUserId(userId);
  }
}
