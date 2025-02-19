import { Guest, GuestStatus } from '@prisma/client';
import { Failure, Ok, Result } from '@src/utils/result';
import { GuestRepository } from '../interfaces/guest_repository';
import prisma from '@src/utils/prisma';

export class PrismaGuestRepository implements GuestRepository {
  async updateGuestStatusById(id: number, status: GuestStatus): Promise<Result<Guest>> {
    try {
      const guest: Guest = await prisma.guest.update({
        where: { id: id },
        data: { status: status },
      });
      return Ok(guest);
    } catch (error) {
      return Failure(error as Error);
    }
  }

  async deleteGuestByIds(userId: number, itineraryId: number): Promise<Result<boolean>> {
    try {
      await prisma.guest.delete({
        where: { userId_itineraryId: { userId: userId, itineraryId: itineraryId } },
      });
      return Ok(true);
    } catch (error) {
      return Failure(error as Error);
    }
  }

  async getAllGuestsForItinerary(itineraryId: number): Promise<Result<Guest[]>> {
    try {
      const guests: Guest[] = await prisma.guest.findMany({ where: { itineraryId: itineraryId } });
      return Ok(guests);
    } catch (error) {
      return Failure(error as Error);
    }
  }

  async getAllGuestsForUser(userId: number): Promise<Result<Guest[]>> {
    try {
      const guests: Guest[] = await prisma.guest.findMany({ where: { userId: userId } });
      return Ok(guests);
    } catch (error) {
      return Failure(error as Error);
    }
  }

  async createGuest(guest: Omit<Guest, 'id'>): Promise<Result<Guest>> {
    try {
      const createdGuest: Guest = await prisma.guest.create({ data: guest });
      return Ok(createdGuest);
    } catch (error) {
      return Failure(error as Error);
    }
  }
}
