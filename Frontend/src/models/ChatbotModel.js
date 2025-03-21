import { apiService } from "../services/ApiService";

export const ChatbotModel = {
  async getSuggestions(context, question) {
    const response = await apiService.post("/suggestions", {
      context,
      question,
    });
    return response.data.suggestions || "";
  },

  async saveEventToDatabase(eventData) {
    const response = await apiService.post("/save-event", eventData);
    return response.data.message;
  },
};
