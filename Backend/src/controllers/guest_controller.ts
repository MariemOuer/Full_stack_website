import prisma_guest_repository from '@src/repositories/concretes/prisma_guest_repository';
import prisma_itinerary_repository from '@src/repositories/concretes/prisma_itinerary_repository';
import prisma_user_repository from '@src/repositories/concretes/prisma_user_repository';

import { GuestService } from '@src/services/repository_services/guest_service';
import { GuestList } from '@src/types/guest_list_result';
import { guestListRelativeRoute } from '@src/utils/constants/route_constants';
import { Result } from '@src/utils/result';
import { consumeResult } from '@src/utils/result_consumer_helpers';
import express, { Request, Response } from 'express';

const router = express.Router();

const guestService = new GuestService({
  guestRepository: prisma_guest_repository,
  itineraryRepository: prisma_itinerary_repository,
  userRepository: prisma_user_repository,
});

router.get(guestListRelativeRoute, async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const { itineraryUUID } = request.params;
  const result: Result<GuestList> = await guestService.fetchGuestListForItineraryId(itineraryUUID);

  return consumeResult(
    result,
    (guests) => response.json(guests),
    (error) => response.status(400).json({ error: error.message })
  );
});

export default router;
