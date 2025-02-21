import { Invitation } from '@src/models/invitation';

export type InvitationListDTO = {
  itineraryUUID: string;
  itineraryPartySize: number;
  invitations: Array<Invitation>;
};
