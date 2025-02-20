import { Guest, GuestStatus } from "@prisma/client";
import { Result } from "@src/utils/result";

export interface GuestRepository {
  getAllGuestsForItinerary(itneraryId: string): Promise<Result<Guest[]>>;
  getAllGuestsForUser(userId: number): Promise<Result<Guest[]>>;
  createGuest(guest: Omit<Guest, "id">): Promise<Result<Guest>>;
  updateGuestStatusById(
    id: number,
    status: GuestStatus,
  ): Promise<Result<Guest>>;
  deleteGuestByIds(
    userId: number,
    itineraryId: string,
  ): Promise<Result<boolean>>;
}
