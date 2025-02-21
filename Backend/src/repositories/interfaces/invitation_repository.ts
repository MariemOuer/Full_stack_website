import { Invitation, InvitationStatus } from '@prisma/client';
import { Result } from '@src/utils/result/result';

export interface InvitationRepository {
  getAllInvitationsForItinerary(itneraryId: string): Promise<Result<Invitation[]>>;
  getAllInvitationsForUser(userId: number): Promise<Result<Invitation[]>>;
  createInvitation(invitation: Omit<Invitation, 'id'>): Promise<Result<Invitation>>;
  updateInvitationStatusByUUID(uuid: string, status: InvitationStatus): Promise<Result<Invitation>>;
  deleteInvitationByIds(userId: number, itineraryId: string): Promise<Result<Invitation>>;
  deleteInvitationByUUID(invitationUUID: string): Promise<Result<Invitation>>;
}
