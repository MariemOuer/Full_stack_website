import { Guest } from '@prisma/client';
import { PrismaGuestRepository } from '@src/repositories/concretes/prisma_guest_repository';
import { PrismaItineraryRepository } from '@src/repositories/concretes/prisma_itinerary_repository';
import { PrismaUserRepository } from '@src/repositories/concretes/prisma_user_repository';
import { GuestService } from '@src/services/repository_services/guest_service';
import { Result } from '@src/utils/result';
import { consumeResult } from '@src/utils/result_consumer_helpers';
import express, { Request, Response } from 'express';

const router = express.Router();

const guestRepository = new PrismaGuestRepository();
const itineraryRepository = new PrismaItineraryRepository();
const userRepository = new PrismaUserRepository();
const guestService = new GuestService({ guestRepository: guestRepository, itineraryRepository: itineraryRepository, userRepository: userRepository });

router.get('/guest-list/:itineraryUUID', async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const { itineraryUUID } = request.params;
  const result: Result<Guest[]> = await guestService.getGuestListForItineraryId(itineraryUUID);

  return consumeResult(
    result,
    (guests) => response.json(guests),
    (error) => response.status(400).json({ error: error.message })
  );
});

export default router;
