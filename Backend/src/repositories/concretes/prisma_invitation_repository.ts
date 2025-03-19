import { Invitation, InvitationStatus, InvitationTemplate } from "@prisma/client";
import { InvitationRepository } from "../interfaces/invitation_repository";
import { safeExecutePrismaOperation } from "../../utils/prisma/prisma_helpers";
import PRISMA from "../../utils/prisma/prisma_client";
import { Result } from "../../utils/result/result";

class PrismaInvitationRepository implements InvitationRepository {
  async createInvitationTemplate(invitationTemplate: Omit<InvitationTemplate, "id">): Promise<Result<InvitationTemplate>> {
    return safeExecutePrismaOperation(() => {
      return PRISMA.invitationTemplate.create({ data: invitationTemplate });
    });
  }
  async getAllInvitationTemplates(authId: string): Promise<Result<InvitationTemplate[]>> {
    return safeExecutePrismaOperation(() => {
      return PRISMA.invitationTemplate.findMany({ where: { userAuthId: authId } });
    });
  }
  async deleteInvitationByUUID(invitationUUID: string): Promise<Result<Invitation>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.invitation.delete({
        where: {
          id: invitationUUID,
        },
      })
    );
  }
  async updateInvitationStatusByUUID(id: string, status: InvitationStatus): Promise<Result<Invitation>> {
    return safeExecutePrismaOperation(
      () =>
        PRISMA.invitation.update({
          where: { id: id, rsvpDeadline: { gt: new Date() } },
          data: { status: status },
        }),
      new Map([["P2025", "Invitation is past the RSVP deadline"]])
    );
  }

  async deleteInvitationByIds(userId: number, itineraryId: string): Promise<Result<Invitation>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.invitation.delete({
        where: {
          userId_itineraryId: { userId: userId, itineraryId: itineraryId },
        },
      })
    );
  }

  async getAllInvitationsForItinerary(itineraryId: string): Promise<Result<Invitation[]>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.invitation.findMany({
        where: { itineraryId: itineraryId },
      })
    );
  }

  async getAllInvitationsForUser(userId: number): Promise<Result<Invitation[]>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.invitation.findMany({
        where: { userId: userId },
      })
    );
  }

  async createInvitation(invitation: Omit<Invitation, "id">): Promise<Result<Invitation>> {
    return safeExecutePrismaOperation(() => PRISMA.invitation.create({ data: invitation }));
  }
}

export default new PrismaInvitationRepository();
