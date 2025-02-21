import { Invitation, InvitationStatus } from '@prisma/client';
import { Result } from '@src/utils/result/result';
import { InvitationRepository } from '../interfaces/invitation_repository';
import PRISMA from '@src/utils/prisma/prisma_client';
import { safeExecutePrismaOperation } from '@src/utils/prisma/prisma_helpers';

class PrismaInvitationRepository implements InvitationRepository {
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
      new Map([['P2025', 'Invitation is past the RSVP deadline']])
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

  async createInvitation(invitation: Omit<Invitation, 'id'>): Promise<Result<Invitation>> {
    return safeExecutePrismaOperation(() => PRISMA.invitation.create({ data: invitation }));
  }
}

export default new PrismaInvitationRepository();
