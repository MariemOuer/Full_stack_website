import { Result } from "@src/utils/result";
import { ItineraryRepository } from "../interfaces/itinerary_repository";

import prisma from "@src/utils/constants/prisma";
import { Itinerary } from "@prisma/client";

class PrismaItineraryRepository implements ItineraryRepository {
  async getItineraryById(itineraryUUID: string): Promise<Result<Itinerary>> {
    try {
      const itinerary: Itinerary = await prisma.itinerary.findUniqueOrThrow({
        where: { id: itineraryUUID },
      });
      return Result.ok(itinerary);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
  async createItinerary(
    itinerary: Omit<Itinerary, "id">,
  ): Promise<Result<Itinerary>> {
    try {
      const createdItinerary: Itinerary = await prisma.itinerary.create({
        data: itinerary,
      });
      return Result.ok(createdItinerary);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
  async deleteItineraryById(itineraryUUID: string): Promise<Result<boolean>> {
    try {
      await prisma.itinerary.delete({ where: { id: itineraryUUID } });
      return Result.ok(true);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
  async updateItinerary(
    itineraryUUID: string,
    data: Partial<Itinerary>,
  ): Promise<Result<Itinerary>> {
    try {
      const itinerary: Itinerary = await prisma.itinerary.update({
        where: { id: itineraryUUID },
        data: data,
      });
      return Result.ok(itinerary);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
  async getAllCreatedItinerariesForUserId(
    userId: number,
  ): Promise<Result<Itinerary[]>> {
    try {
      const itineraries: Itinerary[] = await prisma.itinerary.findMany({
        where: { creatorId: userId },
      });
      return Result.ok(itineraries);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
}

export default new PrismaItineraryRepository();
