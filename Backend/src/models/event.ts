export interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  partySize: number;
  creatorId?: number;
}
