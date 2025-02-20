import { GuestStatus } from "@prisma/client";

export type GuestList = {
  itineraryUUID: string;
  itineraryPartySize: number;
  guests: Array<{
    id: number;
    email: string;
    phoneNumber: string | null;
    name: string;
    authId: string | null;
    status: GuestStatus | undefined;
  }>;
};
