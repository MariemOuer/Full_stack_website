import { Itinerary } from "@prisma/client";
import { Result } from "@src/utils/result";

export interface ItineraryRepository {
  getItineraryById(itineraryUUID: string): Promise<Result<Itinerary>>;
  createItinerary(itinerary: Omit<Itinerary, "id">): Promise<Result<Itinerary>>;
  deleteItineraryById(itineraryUUID: string): Promise<Result<boolean>>;
  updateItinerary(
    itineraryUUID: string,
    data: Partial<Itinerary>,
  ): Promise<Result<Itinerary>>;
  getAllCreatedItinerariesForUserId(
    userId: number,
  ): Promise<Result<Itinerary[]>>;
}
