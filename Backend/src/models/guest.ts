type GuestStatus = 'INVITED' | 'CONFIRMED' | 'DECLINED';

export interface GuestList {
  id: number;
  userId: number;
  eventId: number;
  status: GuestStatus;
}
