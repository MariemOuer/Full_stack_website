import { ChatbotModel } from "../models/ChatbotModel";

export const chatbotController = {
  async getSuggestions(contextText, question) {
    try {
      const suggestionsText = await ChatbotModel.getSuggestions(contextText, question);
      return aiSuggestionsToArray(suggestionsText);
    } catch (err) {
      console.error("Error retrieving suggestions from backend", err);
      return [];
    }
  },

  async saveEvent(eventData) {
    try {
      const message = await ChatbotModel.saveEventToDatabase(eventData);
      return message;
    } catch (error) {
      console.error("Error saving event:", error);
      return "Failed to save event. Please try again.";
    }
  },
};

// Helper function
function aiSuggestionsToArray(text) {
  return text
    .split("\n")
    .filter((line) => line.trim().startsWith("- Option"))
    .map((line) => line.replace(/^- Option\s*\d+:\s*/, "").trim())
    .filter(Boolean);
}
