import { ItineraryRepository } from '@src/repositories/interfaces/itinerary_repository';
import { EmailService } from '../api/email/interfaces/email_service';
import { Result } from '@src/utils/result';
import standardOccasioEmail from '../../utils/constants/standard_invite';
import { Itinerary, User } from '@prisma/client';

import { UserRepository } from '@src/repositories/interfaces/user_repository';
import { EmailResponse } from '@src/types/email_response';
import { itineraryBaseRoute, processInvitationRelativeRoute } from '@src/utils/constants/route_constants';

export class ItineraryService {
  private itineraryRepository: ItineraryRepository;
  private emailService: EmailService;
  private userRepository: UserRepository;

  constructor({
    userRepository,
    itineraryRepository,
    emailService,
  }: {
    userRepository: UserRepository;
    itineraryRepository: ItineraryRepository;
    emailService: EmailService;
  }) {
    this.itineraryRepository = itineraryRepository;
    this.emailService = emailService;
    this.userRepository = userRepository;
  }

  async inviteGuests(guestEmails: string[], itineraryUUID: string): Promise<Result<EmailResponse>> {
    const inviteURI = itineraryBaseRoute + processInvitationRelativeRoute + itineraryUUID;
    return await this.emailService.sendEmails(guestEmails, standardOccasioEmail, inviteURI);
  }

  async fetchItineraryCreator(itineraryUUID: string): Promise<Result<User>> {
    return await this.userRepository.getUserByItineraryId(itineraryUUID);
  }

  async fetchAllCreatedItinerariesFromUser(userId: number): Promise<Result<Itinerary[]>> {
    return await this.itineraryRepository.getAllCreatedItinerariesForUserId(userId);
  }
}
