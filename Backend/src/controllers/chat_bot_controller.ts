import express from "express";
import { GET_LLM_SUGGESTION_RELATIVE_ROUTE } from "../utils/constants/route_constants";
import { safeExecute } from "../utils/general_error_helpers";
import { LLMService } from "../services/external/llm/interfaces/llm_service";
import { RekaaiLLMService } from "../services/external/llm/concretes/rekaai_llm_service";
import { consumeResult } from "../utils/result/result_consumer_helpers";

const router = express.Router();

const llmService: LLMService = new RekaaiLLMService();

router.post(GET_LLM_SUGGESTION_RELATIVE_ROUTE, async (request: express.Request, response: express.Response): Promise<any> => {
  const result = await safeExecute(() => {
    const { context, question } = request.body;
    return llmService.getItinerarySuggestion(context, question);
  });

  return consumeResult(
    result,
    (suggestions) => response.json(suggestions),
    () => response.status(400).json(result)
  );
});

export default router;
