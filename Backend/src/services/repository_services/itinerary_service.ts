import { Itinerary, User } from "@prisma/client";
import { ItineraryRepository } from "../../repositories/interfaces/itinerary_repository";
import { UserRepository } from "../../repositories/interfaces/user_repository";
import { Result } from "../../utils/result/result";
import { ItineraryInfo } from "../../types/itinerary_info";

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

  async createItinerary(itineraryInfo: ItineraryInfo): Promise<Result<Itinerary>> {
    return this.itineraryRepository.createItinerary(itineraryInfo);
  }

  async deleteItinerary(itineraryUUID: string): Promise<Result<Itinerary>> {
    return this.itineraryRepository.deleteItineraryById(itineraryUUID);
  }
}
