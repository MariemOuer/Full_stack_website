import { Result } from "../../../../utils/result/result";

export interface LLMService {
  getItinerarySuggestion(context: string, question: string): Promise<Result<string[]>>;
}
