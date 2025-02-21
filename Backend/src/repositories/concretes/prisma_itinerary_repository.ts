import { Result } from '@src/utils/result';
import { ItineraryRepository } from '../interfaces/itinerary_repository';

import PRISMA from '@src/utils/prisma/prisma_client';
import { Itinerary } from '@prisma/client';
import { safeExecutePrismaOperation } from '@src/utils/prisma/prisma_helpers';

class PrismaItineraryRepository implements ItineraryRepository {
  async getItineraryById(itineraryUUID: string): Promise<Result<Itinerary>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.itinerary.findUniqueOrThrow({
        where: { id: itineraryUUID },
      })
    );
  }
  async createItinerary(itinerary: Omit<Itinerary, 'id'>): Promise<Result<Itinerary>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.itinerary.create({
        data: itinerary,
      })
    );
  }
  async deleteItineraryById(itineraryUUID: string): Promise<Result<Itinerary>> {
    return safeExecutePrismaOperation(() => PRISMA.itinerary.delete({ where: { id: itineraryUUID } }));
  }
  async updateItinerary(itineraryUUID: string, data: Partial<Itinerary>): Promise<Result<Itinerary>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.itinerary.update({
        where: { id: itineraryUUID },
        data: data,
      })
    );
  }
  async getAllCreatedItinerariesForUserId(userId: number): Promise<Result<Itinerary[]>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.itinerary.findMany({
        where: { creatorId: userId },
      })
    );
  }
}

export default new PrismaItineraryRepository();
