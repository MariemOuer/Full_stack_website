import { Guest, GuestStatus } from '@prisma/client';
import { Result } from '@src/utils/result';
import { GuestRepository } from '../interfaces/guest_repository';
import prisma from '@src/utils/constants/prisma';

export class PrismaGuestRepository implements GuestRepository {
  async updateGuestStatusById(id: number, status: GuestStatus): Promise<Result<Guest>> {
    try {
      const guest: Guest = await prisma.guest.update({
        where: { id: id },
        data: { status: status },
      });
      return Result.ok(guest);
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async deleteGuestByIds(userId: number, itineraryId: string): Promise<Result<boolean>> {
    try {
      await prisma.guest.delete({
        where: { userId_itineraryId: { userId: userId, itineraryId: itineraryId } },
      });
      return Result.ok(true);
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async getAllGuestsForItinerary(itineraryId: string): Promise<Result<Guest[]>> {
    try {
      const guests: Guest[] = await prisma.guest.findMany({ where: { itineraryId: itineraryId } });
      return Result.ok(guests);
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async getAllGuestsForUser(userId: number): Promise<Result<Guest[]>> {
    try {
      const guests: Guest[] = await prisma.guest.findMany({ where: { userId: userId } });
      return Result.ok(guests);
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async createGuest(guest: Omit<Guest, 'id'>): Promise<Result<Guest>> {
    try {
      const createdGuest: Guest = await prisma.guest.create({ data: guest });
      return Result.ok(createdGuest);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
}
