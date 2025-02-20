import { Guest, Itinerary, User } from '@prisma/client';
import { GuestRepository } from '@src/repositories/interfaces/guest_repository';
import { ItineraryRepository } from '@src/repositories/interfaces/itinerary_repository';
import { UserRepository } from '@src/repositories/interfaces/user_repository';
import { Failure, Ok, Result } from '@src/utils/result';
import { combineErrors } from '@src/utils/result_consumer_helpers';

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

  async getGuestListForItineraryId(itineraryUUID: string): Promise<Result<any>> {
    const errors: Error[] = [];

    const [guestResult, itineraryResult] = await Promise.all([
      this.guestRepository.getAllGuestsForItinerary(itineraryUUID),
      this.itineraryRepository.getItineraryById(itineraryUUID),
    ]);

    if (guestResult.isError()) errors.push(guestResult.error);
    if (itineraryResult.isError()) errors.push(itineraryResult.error);

    const guests = (guestResult as Ok<Guest[]>).value;
    const itinerary = (itineraryResult as Ok<Itinerary>).value;

    const userIds = guests.map((guest) => guest.userId);
    const userResult = await this.userRepository.getUsersByIds(userIds);

    if (userResult.isError()) errors.push(userResult.error);

    if (errors.length > 0) return Result.error(combineErrors(errors));

    const users = (userResult as Ok<User[]>).value;

    const guestMap = new Map(guests.map((guest) => [guest.userId, { id: guest.id, status: guest.status }]));

    const guestAndUserMerged = users.map((user) => ({
      ...user,
      ...(guestMap.get(user.id) || {}),
    }));

    return Result.ok({
      itineraryUUID,
      itineraryPartySize: itinerary.partySize,
      guests: guestAndUserMerged,
    });
  }
}
