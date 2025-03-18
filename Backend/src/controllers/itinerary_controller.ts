import express from "express";
import { ItineraryService } from "../services/repository_services/itinerary_service";
import prisma_user_repository from "../repositories/concretes/prisma_user_repository";
import prisma_itinerary_repository from "../repositories/concretes/prisma_itinerary_repository";
import { CREATE_ITINERARY_RELATIVE_ROUTE, CREATED_BY_RELATIVE_ROUTE, DELELTE_ITINERARY_RELATIVE_ROUTE } from "../utils/constants/route_constants";
import { safeExecute } from "../utils/general_error_helpers";
import { consumeResult } from "../utils/result/result_consumer_helpers";
import { ItineraryInfo } from "../types/itinerary_info";

const router = express.Router();

const itinerariesService = new ItineraryService({
  userRepository: prisma_user_repository,
  itineraryRepository: prisma_itinerary_repository,
});

router.get(CREATED_BY_RELATIVE_ROUTE + ":userId", async (request: express.Request<{ userId: string }>, response: express.Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const userId = Number(request.params.userId);
    return await itinerariesService.fetchAllCreatedItinerariesFromUser(userId);
  });

  return consumeResult(
    result,
    (itineraries) => response.json(itineraries),
    () => response.status(400).json(result)
  );
});

router.post(CREATE_ITINERARY_RELATIVE_ROUTE, async (request: express.Request, response: express.Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const itineraryInfo: ItineraryInfo = request.body;
    return itinerariesService.createItinerary(itineraryInfo);
  });

  consumeResult(
    result,
    (itinerary) => response.json(itinerary),
    () => response.status(400).json(result)
  );
});

router.delete(DELELTE_ITINERARY_RELATIVE_ROUTE, async (request: express.Request, response: express.Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const { itineraryUUID } = request.body;
    return await itinerariesService.deleteItinerary(itineraryUUID);
  });

  consumeResult(
    result,
    (itinerary) => response.json(itinerary),
    () => response.status(400).json(result)
  );
});

export default router;
