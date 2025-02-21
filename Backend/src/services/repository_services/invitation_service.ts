import { Invitation, InvitationStatus, Itinerary, User } from '@prisma/client';
import { InvitationRepository } from '@src/repositories/interfaces/invitation_repository';
import { ItineraryRepository } from '@src/repositories/interfaces/itinerary_repository';
import { UserRepository } from '@src/repositories/interfaces/user_repository';
import { InvitationListDTO } from '@src/types/invitation_list_DTO';
import { STANDARD_OCCASIO_NOTIFY_BODY } from '@src/utils/constants/email_constants';
import { INVITATION_BASE_ROUTE, OCCASIO_BASE_ROUTE, PROCESS_INVITATION_RELATIVE_ROUTE } from '@src/utils/constants/route_constants';
import { Result } from '@src/utils/result';
import { adaptResultForReturn, getOkValueFromResult } from '@src/utils/result_consumer_helpers';
import { EmailService } from '../external/email/interfaces/email_service';
import { EmailResponseDTO } from '@src/types/email_response_DTO';
import { UserInfo } from '@src/types/user_info';

export class InvitationService {
  private invitationRepository: InvitationRepository;
  private itineraryRepository: ItineraryRepository;
  private userRepository: UserRepository;
  private emailService: EmailService;

  constructor({
    invitationRepository,
    itineraryRepository,
    userRepository,
    emailService,
  }: {
    invitationRepository: InvitationRepository;
    itineraryRepository: ItineraryRepository;
    userRepository: UserRepository;
    emailService: EmailService;
  }) {
    this.invitationRepository = invitationRepository;
    this.itineraryRepository = itineraryRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async fetchInvitationListForItineraryId(itineraryUUID: string): Promise<Result<InvitationListDTO>> {
    const invitationResult = await this.invitationRepository.getAllInvitationsForItinerary(itineraryUUID);
    if (invitationResult.isError()) return adaptResultForReturn(invitationResult);

    const itineraryResult = await this.itineraryRepository.getItineraryById(itineraryUUID);
    if (itineraryResult.isError()) return adaptResultForReturn(itineraryResult);

    const invitations = getOkValueFromResult(invitationResult);
    const userResult = await this.userRepository.getUsersByIds(invitations.map((invitation) => invitation.userId));
    if (userResult.isError()) return adaptResultForReturn(userResult);

    const users = getOkValueFromResult(userResult);
    const itinerary = getOkValueFromResult(itineraryResult);

    return this.createInvitationListResult(users, invitations, itinerary);
  }

  async notifyAllInvitations(invitationEmails: string[]): Promise<Result<EmailResponseDTO>> {
    return await this.emailService.sendEmails(invitationEmails, STANDARD_OCCASIO_NOTIFY_BODY);
  }

  async inviteAllInvitations(userInfos: UserInfo[], itineraryUUID: string): Promise<Result<EmailResponseDTO>> {
    const userResults = await Promise.all(userInfos.map(async (userInfo) => await this.fetchOrCreateUserByEmail(userInfo)));

    for (const result of userResults) {
      if (result.isError()) {
        return adaptResultForReturn(result);
      }
    }

    const invitationResults = await Promise.all(
      userResults.map((userResult) => {
        const user: User = getOkValueFromResult(userResult);
        return this.invitationRepository.createInvitation({
          userId: user.id,
          itineraryId: itineraryUUID,
          status: 'INVITED',
        });
      })
    );

    for (const result of invitationResults) {
      if (result.isError()) {
        return adaptResultForReturn(result);
      }
    }

    const inviteURL = OCCASIO_BASE_ROUTE + INVITATION_BASE_ROUTE + PROCESS_INVITATION_RELATIVE_ROUTE + itineraryUUID;
    return await this.emailService.sendEmails(
      userInfos.map((userInfo) => userInfo.email),
      inviteURL
    );
  }

  async acceptInvitation(invitationUUID: string): Promise<Result<Invitation>> {
    return await this.invitationRepository.updateInvitationStatusByUUID(invitationUUID, InvitationStatus.CONFIRMED);
  }

  async declineInvitation(invitationUUID: string): Promise<Result<Invitation>> {
    return await this.invitationRepository.updateInvitationStatusByUUID(invitationUUID, InvitationStatus.DECLINED);
  }

  async revokeInvitation(invitationUUID: string): Promise<Result<Invitation>> {
    return await this.invitationRepository.deleteInvitationByUUID(invitationUUID);
  }

  private async fetchOrCreateUserByEmail(userInfo: UserInfo): Promise<Result<User>> {
    const userResult = await this.userRepository.getUserByEmail(userInfo.email);

    //Error means it found nothing and therefore must create
    if (userResult.isError()) {
      const createdUserResult = await this.userRepository.createUser({
        email: userInfo.email,
        name: userInfo.name,
        phoneNumber: null,
        authId: null,
      });

      return createdUserResult;
    }

    return userResult;
  }

  private createInvitationListResult(users: User[], invitations: Invitation[], itinerary: Itinerary): Result<InvitationListDTO> {
    const invitationMap = new Map(invitations.map((invitation) => [invitation.userId, { id: invitation.id, status: invitation.status }]));
    const invitationAndUserMerged = users.map((user) => {
      const invitation = invitationMap.get(user.id);
      return {
        ...user,
        ...invitation,
        status: invitation?.status,
      };
    });

    return Result.ok({
      itineraryUUID: itinerary.id,
      itineraryPartySize: itinerary.partySize,
      invitations: invitationAndUserMerged,
    });
  }
}
