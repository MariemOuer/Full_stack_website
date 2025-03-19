import { Invitation, InvitationStatus, InvitationTemplate } from "@prisma/client";
import { Result } from "../../utils/result/result";

export interface InvitationRepository {
  getAllInvitationsForItinerary(itneraryId: string): Promise<Result<Invitation[]>>;
  getAllInvitationsForUser(userId: number): Promise<Result<Invitation[]>>;
  createInvitation(invitation: Omit<Invitation, "id">): Promise<Result<Invitation>>;
  updateInvitationStatusByUUID(uuid: string, status: InvitationStatus): Promise<Result<Invitation>>;
  deleteInvitationByIds(userId: number, itineraryId: string): Promise<Result<Invitation>>;
  deleteInvitationByUUID(invitationUUID: string): Promise<Result<Invitation>>;
  createInvitationTemplate(invitationTemplate: Omit<InvitationTemplate, "id">): Promise<Result<InvitationTemplate>>;
  getAllInvitationTemplates(authId: string): Promise<Result<InvitationTemplate[]>>;
}
