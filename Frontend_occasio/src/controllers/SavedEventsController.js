// controllers/SavedEventsController.js

import { apiService } from "../services/ApiService";

export const SavedEventsController = {
  // Fetch all events from the backend
  async fetchEvents() {
    try {
      const response = await apiService.get("/events");
      return response.data.events || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },
};
