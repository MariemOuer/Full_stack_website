import { Guest } from '@prisma/client';
import { GuestRepository } from '@src/repositories/interfaces/guest_repository';
import { Result } from '@src/utils/result';

export class GuestService {
  private guestRepository: GuestRepository;

  constructor({ guestRepository }: { guestRepository: GuestRepository }) {
    this.guestRepository = guestRepository;
  }

  async getGuestListForItineraryId(itineraryUUID: string): Promise<Result<Guest[]>> {
    return this.guestRepository.getAllGuestsForItinerary(itineraryUUID);
  }
}
