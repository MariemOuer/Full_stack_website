import { Itinerary } from '@prisma/client';
import { Result } from '@src/utils/result';

export interface ItineraryRepository {
  getItineraryById(itineraryId: number): Promise<Result<Itinerary>>;
  createItinerary(itinerary: Omit<Itinerary, 'id'>): Promise<Result<Itinerary>>;
  deleteItineraryById(itineraryId: number): Promise<Result<boolean>>;
  updateItinerary(itineraryId: number, data: Partial<Itinerary>): Promise<Result<Itinerary>>;
  getAllItinerarysForUserId(userId: number): Promise<Result<Itinerary[]>>;
}
