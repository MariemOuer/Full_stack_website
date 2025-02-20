import prisma_guest_repository from '@src/repositories/concretes/prisma_guest_repository';
import prisma_itinerary_repository from '@src/repositories/concretes/prisma_itinerary_repository';
import prisma_user_repository from '@src/repositories/concretes/prisma_user_repository';
import gmail_smtp_email_service from '@src/services/external/email/concretes/gmail_smtp_email_service';
import { GuestService } from '@src/services/repository_services/guest_service';
import { EmailResponseDTO } from '@src/types/email_response_DTO';
import { GuestListDTO } from '@src/types/guest_list_DTO';
import { GUEST_LIST_RELATIVE_ROUTE, INVITE_ALL_RELATIVE_ROUTE, NOTIFY_ALL_RELATIVE_ROUTE } from '@src/utils/constants/route_constants';
import { Result } from '@src/utils/result';
import { consumeResult, getOkValueFromResult } from '@src/utils/result_consumer_helpers';
import express, { Request, Response } from 'express';

const router = express.Router();

const guestService = new GuestService({
  guestRepository: prisma_guest_repository,
  itineraryRepository: prisma_itinerary_repository,
  userRepository: prisma_user_repository,
  emailService: gmail_smtp_email_service,
});

router.get(GUEST_LIST_RELATIVE_ROUTE + ':itineraryUUID', async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const { itineraryUUID } = request.params;
  const result: Result<GuestListDTO> = await guestService.fetchGuestListForItineraryId(itineraryUUID);

  return consumeResult(
    result,
    (guests) => response.json(guests),
    (error) => response.status(400).json({ error: error.message })
  );
});

router.post(NOTIFY_ALL_RELATIVE_ROUTE, async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const { itineraryUUID } = request.params;

  const guestsResult: Result<GuestListDTO> = await guestService.fetchGuestListForItineraryId(itineraryUUID);
  if (guestsResult.isError()) {
    return response.status(400).json({ error: guestsResult.error.message });
  }

  const guestEmails: string[] = getOkValueFromResult(guestsResult).guests.map((guest) => guest.email);

  const emailResult: Result<EmailResponseDTO> = await guestService.notifyAllGuests(guestEmails);
  return consumeResult(
    emailResult,
    () => response.json(emailResult),
    (error) => response.status(400).json({ error: error.message })
  );
});

router.post(INVITE_ALL_RELATIVE_ROUTE, async (request: Request, response: Response): Promise<any> => {
  const { emails, itineraryUUID } = request.body;

  const emailResult: Result<EmailResponseDTO> = await guestService.inviteAllGuests(emails, itineraryUUID);

  return consumeResult(
    emailResult,
    () => response.json(emailResult),
    (error) => response.status(400).json({ error: error.message })
  );
});

export default router;
