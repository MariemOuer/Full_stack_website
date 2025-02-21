import { Invitation } from '@prisma/client';
import prisma_invitation_repository from '@src/repositories/concretes/prisma_invitation_repository';
import prisma_itinerary_repository from '@src/repositories/concretes/prisma_itinerary_repository';
import prisma_user_repository from '@src/repositories/concretes/prisma_user_repository';
import gmail_smtp_email_service from '@src/services/external/email/concretes/gmail_smtp_email_service';
import { InvitationService } from '@src/services/repository_services/invitation_service';
import { EmailResponseDTO } from '@src/types/email_response_DTO';
import { InvitationListDTO } from '@src/types/invitation_list_DTO';
import {
  INVITATION_LIST_RELATIVE_ROUTE,
  INVITE_ALL_RELATIVE_ROUTE,
  NOTIFY_ALL_RELATIVE_ROUTE,
  PROCESS_INVITATION_RELATIVE_ROUTE,
  REVOKE_INVITATION_RELATIVE_ROUTE,
} from '@src/utils/constants/route_constants';
import { Result } from '@src/utils/result';
import { consumeResult, getOkValueFromResult } from '@src/utils/result_consumer_helpers';
import express, { Request, Response } from 'express';

const router = express.Router();

const invitationService = new InvitationService({
  invitationRepository: prisma_invitation_repository,
  itineraryRepository: prisma_itinerary_repository,
  userRepository: prisma_user_repository,
  emailService: gmail_smtp_email_service,
});

router.get(INVITATION_LIST_RELATIVE_ROUTE + ':itineraryUUID', async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const { itineraryUUID } = request.params;
  const result: Result<InvitationListDTO> = await invitationService.fetchInvitationListForItineraryId(itineraryUUID);

  return consumeResult(
    result,
    (invitations) => response.json(invitations),
    (error) => response.status(400).json({ error: error.message })
  );
});

router.post(NOTIFY_ALL_RELATIVE_ROUTE, async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const { itineraryUUID } = request.params;

  const invitationsResult: Result<InvitationListDTO> = await invitationService.fetchInvitationListForItineraryId(itineraryUUID);
  if (invitationsResult.isError()) {
    return response.status(400).json({ error: invitationsResult.error.message });
  }

  const invitationEmails: string[] = getOkValueFromResult(invitationsResult).invitations.map((invitation) => invitation.email);

  const emailResult: Result<EmailResponseDTO> = await invitationService.notifyAllInvitations(invitationEmails);
  return consumeResult(
    emailResult,
    () => response.json(emailResult),
    (error) => response.status(400).json({ error: error.message })
  );
});

router.post(INVITE_ALL_RELATIVE_ROUTE, async (request: Request, response: Response): Promise<any> => {
  const { emails, itineraryUUID } = request.body;

  const emailResult: Result<EmailResponseDTO> = await invitationService.inviteAllInvitations(emails, itineraryUUID);

  return consumeResult(
    emailResult,
    () => response.json(emailResult),
    (error) => response.status(400).json({ error: error.message })
  );
});

router.put(PROCESS_INVITATION_RELATIVE_ROUTE + 'accept/:invitationUUID', async (request: Request, response: Response): Promise<any> => {
  const { invitationUUID } = request.params;

  const acceptResult: Result<Invitation> = await invitationService.acceptInvitation(invitationUUID);

  return consumeResult(
    acceptResult,
    () => response.json(acceptResult),
    (error) => response.status(400).json({ error: error.message })
  );
});

router.put(PROCESS_INVITATION_RELATIVE_ROUTE + 'decline/:invitationUUID', async (request: Request, response: Response): Promise<any> => {
  const { invitationUUID } = request.params;

  const declineResult: Result<Invitation> = await invitationService.declineInvitation(invitationUUID);

  return consumeResult(
    declineResult,
    () => response.json(declineResult),
    (error) => response.status(400).json({ error: error.message })
  );
});

router.post(REVOKE_INVITATION_RELATIVE_ROUTE + ':invitationUUID', async (request: Request, response: Response): Promise<any> => {
  const { invitationUUID } = request.params;

  const revokeResult: Result<Invitation> = await invitationService.revokeInvitation(invitationUUID);

  return consumeResult(
    revokeResult,
    () => response.json({ revokedInvitation: revokeResult }),
    (error) => response.status(400).json({ error: error.message })
  );
});

export default router;
