// controllers/ChatbotController.js - Enhanced with robust suggestion parsing

import { apiService } from "../services/ApiService"; // Import the API service to make API calls

export const chatbotController = {
  // Get suggestions from the backend based on context and the current question
  async getSuggestions(contextText, question) {
    try {
      const response = await apiService.post("/suggestions", {
        context: contextText,
        question,
      });

      // If suggestions are returned, process them into an array of detailed objects
      return response.data.suggestions ? aiSuggestionsToArray(response.data.suggestions) : [];
    } catch (error) {
      console.error("Error retrieving suggestions from backend", error);
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

/**
 * Enhanced function to extract comprehensive suggestion information from AI response text
 * This function handles multiple formats and extracts structured data when available
 *
 * @param {string} text - The AI response text containing suggestions
 * @returns {Array} - Array of suggestion objects with title, date, description, etc.
 */
function aiSuggestionsToArray(text) {
  // First check if we have markdown-formatted options with ** markers
  const optionStartPattern = /\*\*Option\s+(\d+):/g;
  const optionPositions = [];
  let match;

  // Find all option positions in the text
  while ((match = optionStartPattern.exec(text)) !== null) {
    optionPositions.push({
      position: match.index,
      optionNumber: match[1],
    });
  }

  // If we found markdown options, extract all details
  if (optionPositions.length > 0) {
    const fullSuggestions = [];

    // For each option, extract everything until the next option or the end marker
    for (let i = 0; i < optionPositions.length; i++) {
      const startPos = optionPositions[i].position;
      const endPos = i < optionPositions.length - 1 ? optionPositions[i + 1].position : text.indexOf("Each of these options", startPos);

      // If we couldn't find a clear end marker, use the end of the string
      const finalEndPos = endPos > -1 ? endPos : text.length;

      // Extract the full text for this option
      const optionText = text.substring(startPos, finalEndPos).trim();

      // Parse out the structured components
      const titleMatch = optionText.match(/\*\*Option\s+\d+:\s+([^*]+)\*\*/);
      const dateMatch = optionText.match(/\*\*[^*]+\*\*\s+-\s+([^-\n]+)/);

      // Extract the description by removing other components
      let description = optionText;
      if (titleMatch) {
        description = description.replace(titleMatch[0], "").trim();
      }
      if (dateMatch) {
        description = description.replace(`- ${dateMatch[1]}`, "").trim();
      }

      // Clean up formatting artifacts
      description = description.replace(/^[\s-]+/, "").trim();
      description = description.replace(/\n-\s*$/, "").trim();
      description = description.replace(/^\s*-\s+/, "").trim();

      // Add the structured suggestion object
      fullSuggestions.push({
        number: optionPositions[i].optionNumber,
        title: titleMatch ? titleMatch[1].trim() : `Option ${optionPositions[i].optionNumber}`,
        date: dateMatch ? dateMatch[1].trim() : "",
        description: description,
        fullText: optionText,
      });
    }

    console.log("Parsed rich suggestions:", fullSuggestions);
    return fullSuggestions;
  }

  // Fallback 1: Try the original line-by-line approach for "- Option X: Title" format
  try {
    const lineBasedSuggestions = text
      .split("\n")
      .filter((line) => line.trim().startsWith("- Option"))
      .map((line) => line.replace(/^- Option\s*\d+:\s*/, "").trim())
      .filter(Boolean);

    if (lineBasedSuggestions.length > 0) {
      console.log("Parsed line-based suggestions:", lineBasedSuggestions);
      // Convert to object format for consistency
      return lineBasedSuggestions.map((title) => ({ title }));
    }
  } catch (error) {
    console.error("Error parsing line-based suggestions:", error);
  }

  // Fallback 2: Try to extract options using regex patterns
  try {
    // Try markdown format with **Option X: Title**
    const markdownPattern = /\*\*Option\s+(\d+):\s+([^*]+)\*\*/g;
    const markdownMatches = [];

    while ((match = markdownPattern.exec(text)) !== null) {
      markdownMatches.push({
        number: match[1],
        title: match[2].trim(),
        fullText: match[0],
      });
    }

    if (markdownMatches.length > 0) {
      console.log("Parsed markdown pattern suggestions:", markdownMatches);
      return markdownMatches;
    }

    // Try plain format with Option X: Title
    const plainPattern = /Option\s+(\d+):\s+([^\n,]+)/g;
    const plainMatches = [];

    while ((match = plainPattern.exec(text)) !== null) {
      plainMatches.push({
        number: match[1],
        title: match[2].trim(),
        fullText: match[0],
      });
    }

    if (plainMatches.length > 0) {
      console.log("Parsed plain pattern suggestions:", plainMatches);
      return plainMatches;
    }
  } catch (error) {
    console.error("Error parsing regex pattern suggestions:", error);
  }

  // Last resort: Try to extract any lines that mention options
  try {
    const lastResort = text
      .split("\n")
      .filter((line) => /option|suggestion|idea|recommend/i.test(line))
      .map((line) => line.trim())
      .filter(Boolean);

    if (lastResort.length > 0) {
      console.log("Last resort suggestions:", lastResort);
      return lastResort.map((line) => ({ title: line }));
    }
  } catch (error) {
    console.error("Error in last resort parsing:", error);
  }

  console.warn("No suggestions found in text:", text.substring(0, 100) + "...");
  return []; // Return empty array if all parsing attempts fail
}

// Export the parsing function directly if needed elsewhere
export { aiSuggestionsToArray };
