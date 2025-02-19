import { Itinerary } from '@prisma/client';
import { Result } from '@src/utils/result';

export interface ItineraryRepository {
  getItineraryById(itineraryId: string): Promise<Result<Itinerary>>;
  createItinerary(itinerary: Omit<Itinerary, 'id'>): Promise<Result<Itinerary>>;
  deleteItineraryById(itineraryId: string): Promise<Result<boolean>>;
  updateItinerary(itineraryId: string, data: Partial<Itinerary>): Promise<Result<Itinerary>>;
  getAllItinerarysForUserId(userId: number): Promise<Result<Itinerary[]>>;
}
