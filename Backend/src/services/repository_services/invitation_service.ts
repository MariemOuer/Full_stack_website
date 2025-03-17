import { Invitation, InvitationStatus, Itinerary, User } from '@prisma/client';
import { InvitationRepository } from '../../repositories/interfaces/invitation_repository';
import { ItineraryRepository } from '../../repositories/interfaces/itinerary_repository';
import { UserRepository } from '../../repositories/interfaces/user_repository';
import { EmailResponseDTO } from '../../types/email_response_DTO';
import { InvitationListDTO } from '../../types/invitation_list_DTO';
import { STANDARD_OCCASIO_NOTIFY_BODY } from '../../utils/constants/email_constants';
import { OCCASIO_BASE_ROUTE, INVITATION_BASE_ROUTE, PROCESS_INVITATION_RELATIVE_ROUTE } from '../../utils/constants/route_constants';
import { Failure, Result } from '../../utils/result/result';
import { getOkValueFromResult } from '../../utils/result/result_consumer_helpers';
import { EmailService } from '../external/email/interfaces/email_service';
import { UserInfo } from '../../types/user_info';



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

  async fetchInvitationListForItineraryId(itineraryUUID: string): Promise<any> {
    const invitationResult = await this.invitationRepository.getAllInvitationsForItinerary(itineraryUUID);
    if (invitationResult instanceof Failure) return invitationResult as Failure<InvitationListDTO, typeof invitationResult.error>;

    const itineraryResult = await this.itineraryRepository.getItineraryById(itineraryUUID);
    if (itineraryResult instanceof Failure) return itineraryResult as Failure<InvitationListDTO, typeof itineraryResult.error>;

    const invitations = getOkValueFromResult(invitationResult);
    const userResult = await this.userRepository.getUsersByIds(invitations.map((invitation) => invitation.userId));
    if (userResult instanceof Failure) return userResult as Failure<InvitationListDTO, typeof userResult.error>;

    const users = getOkValueFromResult(userResult);
    const itinerary = getOkValueFromResult(itineraryResult);

    return this.createInvitationListResult(users, invitations, itinerary);
  }

  async notifyAllInvitations(invitationEmails: string[]): Promise<Result<EmailResponseDTO>> {
    return await this.emailService.sendEmails(invitationEmails, STANDARD_OCCASIO_NOTIFY_BODY);
  }

  async inviteAllInvitations(userInfos: UserInfo[], itineraryUUID: string, rsvpDeadline: Date): Promise<Result<EmailResponseDTO>> {
    const userResults: Result<User>[] = [];
    for (const userInfo of userInfos) {
      const userResult = await this.fetchOrCreateUserByEmail(userInfo);
      if (userResult instanceof Failure) return userResult;
      userResults.push(userResult);
    }

    const invitationResults: Result<Invitation>[] = [];
    for (const userResult of userResults) {
      const user = getOkValueFromResult(userResult);
      const invitationResult = await this.invitationRepository.createInvitation({
        userId: user.id,
        itineraryId: itineraryUUID,
        status: 'INVITED',
        rsvpDeadline,
      });

      if (invitationResult instanceof Failure) return invitationResult;
      invitationResults.push(invitationResult);
    }

    const inviteURL = `${OCCASIO_BASE_ROUTE}${INVITATION_BASE_ROUTE}${PROCESS_INVITATION_RELATIVE_ROUTE}${itineraryUUID}`;
    return this.emailService.sendEmails(
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
    const invitationMap = new Map(
      invitations.map((invitation) => [invitation.userId, { id: invitation.id, status: invitation.status, rsvpDeadline: invitation.rsvpDeadline }])
    );
    const invitationAndUserMerged = users.map((user) => {
      const invitation = invitationMap.get(user.id);
      return {
        ...user,
        ...invitation,
        status: invitation?.status ?? InvitationStatus.INVITED,
        rsvpDeadline: invitation?.rsvpDeadline ?? new Date(),
      };
    });

    return Result.ok({
      itineraryUUID: itinerary.id,
      itineraryPartySize: itinerary.partySize,
      invitations: invitationAndUserMerged,
    });
  }
}
