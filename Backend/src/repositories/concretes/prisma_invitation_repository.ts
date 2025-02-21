import { Invitation, InvitationStatus } from '@prisma/client';
import { Result } from '@src/utils/result';
import { InvitationRepository } from '../interfaces/invitation_repository';
import PRISMA from '@src/utils/constants/prisma';

class PrismaInvitationRepository implements InvitationRepository {
  async deleteInvitationByUUID(invitationUUID: string): Promise<Result<Invitation>> {
    try {
      const deletedInvitation: Invitation = await PRISMA.invitation.delete({
        where: {
          id: invitationUUID,
        },
      });
      return Result.ok(deletedInvitation);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
  async updateInvitationStatusByUUID(id: string, status: InvitationStatus): Promise<Result<Invitation>> {
    try {
      const invitation: Invitation = await PRISMA.invitation.update({
        where: { id: id },
        data: { status: status },
      });
      return Result.ok(invitation);
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async deleteInvitationByIds(userId: number, itineraryId: string): Promise<Result<Invitation>> {
    try {
      const deletedInvitation: Invitation = await PRISMA.invitation.delete({
        where: {
          userId_itineraryId: { userId: userId, itineraryId: itineraryId },
        },
      });
      return Result.ok(deletedInvitation);
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async getAllInvitationsForItinerary(itineraryId: string): Promise<Result<Invitation[]>> {
    try {
      const invitations: Invitation[] = await PRISMA.invitation.findMany({
        where: { itineraryId: itineraryId },
      });
      return Result.ok(invitations);
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async getAllInvitationsForUser(userId: number): Promise<Result<Invitation[]>> {
    try {
      const invitations: Invitation[] = await PRISMA.invitation.findMany({
        where: { userId: userId },
      });
      return Result.ok(invitations);
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async createInvitation(invitation: Omit<Invitation, 'id'>): Promise<Result<Invitation>> {
    try {
      const createdInvitation: Invitation = await PRISMA.invitation.create({ data: invitation });
      return Result.ok(createdInvitation);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
}

export default new PrismaInvitationRepository();
