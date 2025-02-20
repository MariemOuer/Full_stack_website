import { GuestStatus } from '@prisma/client';

export type GuestListDTO = {
  itineraryUUID: string;
  itineraryPartySize: number;
  guests: Array<{
    id: string | number;
    email: string;
    phoneNumber: string | null;
    name: string;
    authId: string | null;
    status: GuestStatus | undefined;
  }>;
};
