import express from 'express';
import { ItineraryService } from '@src/services/repository_services/itinerary_service';

import { Request, Response } from 'express';
import { Failure, Result } from '@src/utils/result';
import { Itinerary, User } from '@prisma/client';
import { consumeResult, getOkValueFromResult } from '@src/utils/result_consumer_helpers';
import { GuestService } from '@src/services/repository_services/guest_service';
import prisma_guest_repository from '@src/repositories/concretes/prisma_guest_repository';
import prisma_itinerary_repository from '@src/repositories/concretes/prisma_itinerary_repository';
import prisma_user_repository from '@src/repositories/concretes/prisma_user_repository';
import { GuestList } from '@src/types/guest_list_result';
import gmail_smtp_email_service from '@src/services/api/email/concretes/gmail_smtp_email_service';
import { EmailResponse } from '@src/types/email_response';
import { createdByRelativeRoute, inviteAllRelativeRoute } from '@src/utils/constants/route_constants';

const router = express.Router();

const guestService = new GuestService({
  guestRepository: prisma_guest_repository,
  itineraryRepository: prisma_itinerary_repository,
  userRepository: prisma_user_repository,
});
const itinerariesService = new ItineraryService({
  userRepository: prisma_user_repository,
  itineraryRepository: prisma_itinerary_repository,
  emailService: gmail_smtp_email_service,
});

router.get(createdByRelativeRoute, async (request: Request<{ userId: string }>, response: Response): Promise<any> => {
  const userId = Number(request.params.userId);
  const result: Result<Itinerary[]> = await itinerariesService.fetchAllCreatedItinerariesFromUser(userId);

  return consumeResult(
    result,
    (itineraries) => response.json(itineraries),
    (error) => response.status(400).json({ error: error.message })
  );
});

router.post(inviteAllRelativeRoute, async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const { itineraryUUID } = request.params;

  const userResult: Result<User> = await itinerariesService.fetchItineraryCreator(itineraryUUID);
  if (userResult.isError()) return response.status(400).json({ error: (userResult as Failure<User>).error });

  const guestsResult: Result<GuestList> = await guestService.fetchGuestListForItineraryId(itineraryUUID);
  if (guestsResult.isError()) {
    return response.status(400).json({ error: guestsResult.error.message });
  }

  const guestEmails: string[] = getOkValueFromResult(guestsResult).guests.map((guest) => guest.email);

  const emailResult: Result<EmailResponse> = await itinerariesService.inviteGuests(guestEmails, itineraryUUID);
  return consumeResult(
    emailResult,
    () => response.json(emailResult),
    (error) => response.status(400).json({ error: error.message })
  );
});

export default router;
