import { Failure, Ok, Result } from '@src/utils/result';
import { ItineraryRepository } from '../interfaces/itinerary_repository';

import prisma from '@src/utils/constants/prisma';
import { Itinerary } from '@prisma/client';

export class PrismaItineraryRepository implements ItineraryRepository {
  async getItineraryById(itineraryId: string): Promise<Result<Itinerary>> {
    try {
      const itinerary: Itinerary = await prisma.itinerary.findUniqueOrThrow({ where: { id: itineraryId } });
      return Ok(itinerary);
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async createItinerary(itinerary: Omit<Itinerary, 'id'>): Promise<Result<Itinerary>> {
    try {
      const createdItinerary: Itinerary = await prisma.itinerary.create({ data: itinerary });
      return Ok(createdItinerary);
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async deleteItineraryById(itineraryId: string): Promise<Result<boolean>> {
    try {
      await prisma.itinerary.delete({ where: { id: itineraryId } });
      return Ok(true);
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async updateItinerary(itineraryId: string, data: Partial<Itinerary>): Promise<Result<Itinerary>> {
    try {
      const itinerary: Itinerary = await prisma.itinerary.update({ where: { id: itineraryId }, data: data });
      return Ok(itinerary);
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async getAllCreatedItinerariesForUserId(userId: number): Promise<Result<Itinerary[]>> {
    try {
      const itineraries: Itinerary[] = await prisma.itinerary.findMany({ where: { creatorId: userId } });
      return Ok(itineraries);
    } catch (error) {
      return Failure(error as Error);
    }
  }
}
