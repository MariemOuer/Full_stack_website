import { Guest } from '@prisma/client';
import { PrismaGuestRepository } from '@src/repositories/concretes/prisma_guest_repository';
import { GuestService } from '@src/services/repository_services/guest_service';
import { Result } from '@src/utils/result';
import express, { Request, Response } from 'express';

const router = express.Router();

const guestRepository = new PrismaGuestRepository();
const guestService = new GuestService({ guestRepository: guestRepository });

router.get('/guest-list/:itineraryUUID', async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const { itineraryUUID } = request.params;
  const result: Result<Guest[]> = await guestService.getGuestListForItineraryId(itineraryUUID);

  if ('error' in result) {
    return response.status(400).json({ error: result.error.message });
  }

  return response.json(result.value);
});

export default router;
