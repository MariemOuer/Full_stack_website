import express from 'express';
import { ItineraryService } from '@src/services/repository_services/itinerary_service';

import { Request, Response } from 'express';
import { consumeResult } from '@src/utils/result/result_consumer_helpers';
import prisma_itinerary_repository from '@src/repositories/concretes/prisma_itinerary_repository';
import prisma_user_repository from '@src/repositories/concretes/prisma_user_repository';
import { CREATED_BY_RELATIVE_ROUTE } from '@src/utils/constants/route_constants';
import { safeExecute } from '@src/utils/general_error_helpers';

const router = express.Router();

const itinerariesService = new ItineraryService({
  userRepository: prisma_user_repository,
  itineraryRepository: prisma_itinerary_repository,
});

router.get(CREATED_BY_RELATIVE_ROUTE + ':userId', async (request: Request<{ userId: string }>, response: Response): Promise<any> => {
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

export default router;
