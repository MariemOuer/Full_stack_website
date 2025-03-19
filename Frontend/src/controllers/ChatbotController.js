// controllers/ChatbotController.js

import { apiService } from "../services/ApiService"; // Import the API service to make API calls

export const chatbotController = {
  // Get suggestions from the backend based on context and the current question
  async getSuggestions(contextText, question) {
    try {
      const response = await apiService.post("/suggestions", {
        context: contextText,
        question,
      });

      // If suggestions are returned, process them into an array
      return response.data.suggestions
        ? aiSuggestionsToArray(response.data.suggestions)
        : [];
    } catch (err) {
      console.error("Error retrieving suggestions from backend", err);
      return []; // Return an empty array if an error occurs
    }
  },

  // Save the event data to the backend
  async saveEvent(eventData) {
    try {
      const response = await apiService.post("/save-event", eventData);
      return response.data.message; // Return the success message from the backend
    } catch (error) {
      console.error("Error saving event:", error);
      return "Failed to save event. Please try again."; // Return error message if saving fails
    }
  },
};

// Helper function to convert AI suggestion text into an array of suggestions
function aiSuggestionsToArray(text) {
  return text
    .split("\n")
    .filter((line) => line.trim().startsWith("- Option"))
    .map((line) => line.replace(/^- Option\s*\d+:\s*/, "").trim())
    .filter(Boolean);
}
