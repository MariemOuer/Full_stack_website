import { InvitationStatus } from '@prisma/client';

export type InvitationListDTO = {
  itineraryUUID: string;
  itineraryPartySize: number;
  invitations: Array<{
    id: string | number;
    email: string;
    phoneNumber: string | null;
    name: string;
    authId: string | null;
    status: InvitationStatus | undefined;
    rsvpDeadline: Date;
    plusOnes: number;
  }>;
};
