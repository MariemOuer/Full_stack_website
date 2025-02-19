import { Failure, Ok, Result } from '@src/utils/result';
import { ItineraryRepository } from '../interfaces/itinerary_repository';

import prisma from '@src/utils/prisma';
import { Itinerary } from '@prisma/client';

export class PrismaItineraryRepository implements ItineraryRepository {
  async getItineraryById(itineraryId: number): Promise<Result<Itinerary>> {
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
  async deleteItineraryById(itineraryId: number): Promise<Result<boolean>> {
    try {
      await prisma.itinerary.delete({ where: { id: itineraryId } });
      return Ok(true);
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async updateItinerary(itineraryId: number, data: Partial<Itinerary>): Promise<Result<Itinerary>> {
    try {
      const itinerary: Itinerary = await prisma.itinerary.update({ where: { id: itineraryId }, data: data });
      return Ok(itinerary);
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async getAllItinerarysForUserId(userId: number): Promise<Result<Itinerary[]>> {
    try {
      const itineraries: Itinerary[] = await prisma.itinerary.findMany({ where: { creatorId: userId } });
      return Ok(itineraries);
    } catch (error) {
      return Failure(error as Error);
    }
  }
}
