import { EventModel } from "../models/EventModel";

export const SavedEventsController = {
  async fetchEvents() {
    try {
      const events = await EventModel.getAllEvents();
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },
};
