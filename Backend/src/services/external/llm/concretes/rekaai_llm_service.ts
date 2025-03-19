import { SUGGESTION_INSTRUCTIONS } from "../../../../utils/constants/llm_constants";
import { safeExecute } from "../../../../utils/general_error_helpers";
import { Result } from "../../../../utils/result/result";
import { LLMService } from "../interfaces/llm_service";

export class RekaaiLLMService implements LLMService {
  async getItinerarySuggestion(context: string, question: string): Promise<Result<string[]>> {
    const suggestionInstructions: string = `Based on the following details ${context} and the question ${question}. ` + SUGGESTION_INSTRUCTIONS;

    return safeExecute(async () => {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "rekaai/reka-flash-3:free",
          messages: [{ role: "user", content: suggestionInstructions }],
          temperature: 0.3,
        }),
      }).then((data) => data.json());

      return this.parseSuggestionReply(response);
    });
  }

  private parseSuggestionReply(response: any): string[] {
    if (response.choices && response.choices.length > 0 && response.choices[0].message) {
      const suggestionText = response.choices[0].message.content.trim();

      // Regex to match "- Option X: Suggestion text"
      const regex = /- Option \d+: (.+)/g;
      const suggestions: string[] = [];
      let match;

      // Extract matches using regex
      while ((match = regex.exec(suggestionText)) !== null) {
        suggestions.push(match[1].trim());
      }

      // Ensure exactly 3 suggestions, otherwise log a warning
      if (suggestions.length !== 3) {
        console.warn("Unexpected AI response format. Extracted suggestions:", suggestions);
      }

      console.log(suggestions);
      return suggestions;
    }

    throw new Error("No valid suggestions found in AI response");
  }
}
