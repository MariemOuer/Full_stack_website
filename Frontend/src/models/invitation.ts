export type InvitationStatus = 'CONFIRMED' | 'DECLINED' | 'INVITED';

export type Invitation = {
  id: string | number;
  email: string;
  phoneNumber: string | null;
  name: string;
  authId: string | null;
  status: InvitationStatus | undefined;
  rsvpDeadline: Date;
};
