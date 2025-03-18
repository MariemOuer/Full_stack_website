import { Itinerary } from "@prisma/client";

export type ItineraryInfo = Omit<Itinerary, "id">;
