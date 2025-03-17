
import express, { Request, Response } from 'express';
import { InvitationService } from '../services/repository_services/invitation_service';
import prisma_invitation_repository from '../repositories/concretes/prisma_invitation_repository';
import prisma_itinerary_repository from '../repositories/concretes/prisma_itinerary_repository';
import prisma_user_repository from '../repositories/concretes/prisma_user_repository';
import gmail_smtp_email_service from '../services/external/email/concretes/gmail_smtp_email_service';
import { INVITATION_LIST_RELATIVE_ROUTE, INVITE_ALL_RELATIVE_ROUTE, NOTIFY_ALL_RELATIVE_ROUTE, PROCESS_INVITATION_RELATIVE_ROUTE, REVOKE_INVITATION_RELATIVE_ROUTE } from '../utils/constants/route_constants';
import { safeExecute } from '../utils/general_error_helpers';
import { consumeResult, getOkValueFromResult } from '../utils/result/result_consumer_helpers';
import { Result } from '../utils/result/result';
import { InvitationListDTO } from '../types/invitation_list_DTO';
import { EmailResponseDTO } from '../types/email_response_DTO';


const router = express.Router();

const invitationService = new InvitationService({
  invitationRepository: prisma_invitation_repository,
  itineraryRepository: prisma_itinerary_repository,
  userRepository: prisma_user_repository,
  emailService: gmail_smtp_email_service,
});

router.get(INVITATION_LIST_RELATIVE_ROUTE + ':itineraryUUID', async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const { itineraryUUID } = request.params;
    return await invitationService.fetchInvitationListForItineraryId(itineraryUUID);
  });

  return consumeResult(
    result,
    (invitations) => response.json(invitations),
    () => response.status(400).json(result)
  );
});

router.post(NOTIFY_ALL_RELATIVE_ROUTE + ':itineraryUUID', async (request: Request<{ itineraryUUID: string }>, response: Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const { itineraryUUID } = request.params;

    //Must find the invite list first
    const invitationsResult: Result<InvitationListDTO> = await invitationService.fetchInvitationListForItineraryId(itineraryUUID);
    if (invitationsResult.isError()) {
      return invitationsResult;
    }

    const invitationEmails: string[] = getOkValueFromResult(invitationsResult).invitations.map((invitation) => invitation.email);

    //Now that we have all emails on the invitation list, notify all
    return await invitationService.notifyAllInvitations(invitationEmails);
  });

  return consumeResult(
    result,
    () => response.json(result),
    () => response.status(400).json(result)
  );
});

router.post(INVITE_ALL_RELATIVE_ROUTE, async (request: Request, response: Response): Promise<any> => {
  const result: Result<Result<EmailResponseDTO>> = await safeExecute(async () => {
    const { emails, itineraryUUID, rsvpDeadline } = request.body;

    return await invitationService.inviteAllInvitations(emails, itineraryUUID, rsvpDeadline);
  });

  return consumeResult(
    result,
    () => response.json(result),
    () => response.status(400).json(result)
  );
});

router.put(PROCESS_INVITATION_RELATIVE_ROUTE + 'accept/:invitationUUID', async (request: Request, response: Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const { invitationUUID } = request.params;

    return await invitationService.acceptInvitation(invitationUUID);
  });

  return consumeResult(
    result,
    () => response.json(result),
    () => response.status(400).json(result)
  );
});

router.put(PROCESS_INVITATION_RELATIVE_ROUTE + 'decline/:invitationUUID', async (request: Request, response: Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const { invitationUUID } = request.params;

    return await invitationService.declineInvitation(invitationUUID);
  });

  return consumeResult(
    result,
    () => response.json(result),
    () => response.status(400).json(result)
  );
});

router.post(REVOKE_INVITATION_RELATIVE_ROUTE + ':invitationUUID', async (request: Request, response: Response): Promise<any> => {
  const result = await safeExecute(async () => {
    const { invitationUUID } = request.params;

    return await invitationService.revokeInvitation(invitationUUID);
  });

  return consumeResult(
    result,
    () => response.json({ revokedInvitation: result }),
    () => response.status(400).json(result)
  );
});

export default router;
