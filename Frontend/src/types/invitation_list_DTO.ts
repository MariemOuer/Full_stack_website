import { Invitation } from "../models/invitation";

export type InvitationListDTO = {
  itineraryUUID: string;
  itineraryPartySize: number;
  invitations: Array<Invitation>;
};
