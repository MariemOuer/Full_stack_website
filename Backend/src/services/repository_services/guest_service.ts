import { Guest, Itinerary, User } from '@prisma/client';
import { GuestRepository } from '@src/repositories/interfaces/guest_repository';
import { ItineraryRepository } from '@src/repositories/interfaces/itinerary_repository';
import { UserRepository } from '@src/repositories/interfaces/user_repository';
import { GuestList } from '@src/types/guest_list_result';
import { Result } from '@src/utils/result';
import { adaptResultForReturn, getOkValueFromResult } from '@src/utils/result_consumer_helpers';

export class GuestService {
  private guestRepository: GuestRepository;
  private itineraryRepository: ItineraryRepository;
  private userRepository: UserRepository;

  constructor({
    guestRepository,
    itineraryRepository,
    userRepository,
  }: {
    guestRepository: GuestRepository;
    itineraryRepository: ItineraryRepository;
    userRepository: UserRepository;
  }) {
    this.guestRepository = guestRepository;
    this.itineraryRepository = itineraryRepository;
    this.userRepository = userRepository;
  }

  async fetchGuestListForItineraryId(itineraryUUID: string): Promise<Result<GuestList>> {
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

  private createGuestListResult(users: User[], guests: Guest[], itinerary: Itinerary): Result<GuestList> {
    const guestMap = new Map(guests.map((guest) => [guest.userId, { id: guest.id, status: guest.status }]));
    const guestAndUserMerged = users.map((user) => {
      const guest = guestMap.get(user.id) || { id: 0, status: undefined };
      return {
        ...user,
        ...guest,
        status: guest.status,
      };
    });

    return Result.ok({
      itineraryUUID: itinerary.id,
      itineraryPartySize: itinerary.partySize,
      guests: guestAndUserMerged,
    });
  }
}
