import { apiService } from "../services/ApiService";

export const EventModel = {
  async getAllEvents() {
    const response = await apiService.get("/events");
    return response.data.events || [];
  },
};
