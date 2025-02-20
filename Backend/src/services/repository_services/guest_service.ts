import { Guest, GuestStatus, Itinerary, User } from '@prisma/client';
import { GuestRepository } from '@src/repositories/interfaces/guest_repository';
import { ItineraryRepository } from '@src/repositories/interfaces/itinerary_repository';
import { UserRepository } from '@src/repositories/interfaces/user_repository';
import { GuestListDTO } from '@src/types/guest_list_DTO';
import { STANDARD_OCCASIO_NOTIFY_BODY } from '@src/utils/constants/email_constants';
import { GUEST_BASE_ROUTE, OCCASIO_BASE_ROUTE, PROCESS_INVITATION_RELATIVE_ROUTE } from '@src/utils/constants/route_constants';
import { Ok, Result } from '@src/utils/result';
import { adaptResultForReturn, getOkValueFromResult } from '@src/utils/result_consumer_helpers';
import { EmailService } from '../external/email/interfaces/email_service';
import { EmailResponseDTO } from '@src/types/email_response_DTO';
import { UserInfo } from '@src/types/user_info';

export class GuestService {
  private guestRepository: GuestRepository;
  private itineraryRepository: ItineraryRepository;
  private userRepository: UserRepository;
  private emailService: EmailService;

  constructor({
    guestRepository,
    itineraryRepository,
    userRepository,
    emailService,
  }: {
    guestRepository: GuestRepository;
    itineraryRepository: ItineraryRepository;
    userRepository: UserRepository;
    emailService: EmailService;
  }) {
    this.guestRepository = guestRepository;
    this.itineraryRepository = itineraryRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async fetchGuestListForItineraryId(itineraryUUID: string): Promise<Result<GuestListDTO>> {
    const guestResult = await this.guestRepository.getAllGuestsForItinerary(itineraryUUID);
    if (guestResult.isError()) return adaptResultForReturn(guestResult);

    const itineraryResult = await this.itineraryRepository.getItineraryById(itineraryUUID);
    if (itineraryResult.isError()) return adaptResultForReturn(itineraryResult);

    const guests = getOkValueFromResult(guestResult);
    const userResult = await this.userRepository.getUsersByIds(guests.map((guest) => guest.userId));
    if (userResult.isError()) return adaptResultForReturn(userResult);

    const users = getOkValueFromResult(userResult);
    const itinerary = getOkValueFromResult(itineraryResult);

    return this.createGuestListResult(users, guests, itinerary);
  }

  async notifyAllGuests(guestEmails: string[]): Promise<Result<EmailResponseDTO>> {
    return await this.emailService.sendEmails(guestEmails, STANDARD_OCCASIO_NOTIFY_BODY);
  }

  async inviteAllGuests(userInfos: UserInfo[], itineraryUUID: string): Promise<Result<EmailResponseDTO>> {
    const userResults = await Promise.all(userInfos.map(async (userInfo) => await this.fetchOrCreateUserByEmail(userInfo)));

    for (const result of userResults) {
      if (result.isError()) {
        return adaptResultForReturn(result);
      }
    }

    const guestResults = await Promise.all(
      userResults.map((userResult) => {
        const user: User = getOkValueFromResult(userResult);
        return this.guestRepository.createGuest({
          userId: user.id,
          itineraryId: itineraryUUID,
          status: 'INVITED',
        });
      })
    );

    for (const result of guestResults) {
      if (result.isError()) {
        return adaptResultForReturn(result);
      }
    }

    const inviteURL = OCCASIO_BASE_ROUTE + GUEST_BASE_ROUTE + PROCESS_INVITATION_RELATIVE_ROUTE + itineraryUUID;
    return await this.emailService.sendEmails(
      userInfos.map((userInfo) => userInfo.email),
      inviteURL
    );
  }

  async acceptInvitation(invitationUUID: string): Promise<Result<Guest>> {
    return await this.guestRepository.updateGuestStatusByUUID(invitationUUID, GuestStatus.CONFIRMED);
  }

  async declineInvitation(invitationUUID: string): Promise<Result<Guest>> {
    return await this.guestRepository.updateGuestStatusByUUID(invitationUUID, GuestStatus.DECLINED);
  }

  private async fetchOrCreateUserByEmail(userInfo: UserInfo): Promise<Result<User>> {
    const userResult = await this.userRepository.getUserByEmail(userInfo.email);

    //Error means it found nothing and therefore must create
    if (userResult.isError()) {
      const createdUserResult = await this.userRepository.createUser({
        email: userInfo.email,
        name: userInfo.name,
        phoneNumber: null,
        authId: null,
      });

      return createdUserResult;
    }

    return userResult;
  }

  private createGuestListResult(users: User[], guests: Guest[], itinerary: Itinerary): Result<GuestListDTO> {
    const guestMap = new Map(guests.map((guest) => [guest.userId, { id: guest.id, status: guest.status }]));
    const guestAndUserMerged = users.map((user) => {
      const guest = guestMap.get(user.id);
      return {
        ...user,
        ...guest,
        status: guest?.status,
      };
    });

    return Result.ok({
      itineraryUUID: itinerary.id,
      itineraryPartySize: itinerary.partySize,
      guests: guestAndUserMerged,
    });
  }
}
