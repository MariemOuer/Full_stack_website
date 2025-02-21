import { ItineraryRepository } from '@src/repositories/interfaces/itinerary_repository';
import { Result } from '@src/utils/result/result';
import { Itinerary, User } from '@prisma/client';

import { UserRepository } from '@src/repositories/interfaces/user_repository';

export class ItineraryService {
  private itineraryRepository: ItineraryRepository;
  private userRepository: UserRepository;

  constructor({ userRepository, itineraryRepository }: { userRepository: UserRepository; itineraryRepository: ItineraryRepository }) {
    this.itineraryRepository = itineraryRepository;
    this.userRepository = userRepository;
  }

  async fetchItineraryCreator(itineraryUUID: string): Promise<Result<User>> {
    return await this.userRepository.getUserByItineraryId(itineraryUUID);
  }

  async fetchAllCreatedItinerariesFromUser(userId: number): Promise<Result<Itinerary[]>> {
    return await this.itineraryRepository.getAllCreatedItinerariesForUserId(userId);
  }
}
