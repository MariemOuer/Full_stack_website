import express from "express";
import { GET_LLM_SUGGESTION_RELATIVE_ROUTE } from "../utils/constants/route_constants";
import { safeExecute } from "../utils/general_error_helpers";
import { LLMService } from "../services/external/llm/interfaces/llm_service";
import { RekaaiLLMService } from "../services/external/llm/concretes/rekaai_llm_service";
import { consumeResult } from "../utils/result/result_consumer_helpers";
import { ChatbotMemoryInfo } from "../types/chatbot_memory_info";
import { LLMMemorySnapshotService } from "../services/repository_services/llm_memory_snapshot_service";
import PrismaLLMMemorySnapshotRepositoryInstance from "../repositories/concretes/prisma_llm_memory_snapshot_repository";

const router = express.Router();

const llmService: LLMService = new RekaaiLLMService();
const llmMemorySnapshotService: LLMMemorySnapshotService = new LLMMemorySnapshotService({ llmMemorySnapshotRepository: PrismaLLMMemorySnapshotRepositoryInstance });

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

router.post("/save-event", async (request: express.Request, response: express.Response): Promise<any> => {
  const result = await safeExecute(() => {
    const chatbotMemoryInfo: ChatbotMemoryInfo = request.body;

    return llmMemorySnapshotService.createMemorySnapshot(chatbotMemoryInfo);
  });

  return consumeResult(
    result,
    (chatbotMemorySnapshot) => response.json(chatbotMemorySnapshot),
    () => response.status(400).json(result)
  );
});

router.get("/all-events", async (request: express.Request, response: express.Response): Promise<any> => {
  const result = await safeExecute(() => {
    return llmMemorySnapshotService.getAllMemorySnapshots();
  });

  return consumeResult(
    result,
    (chatbotMemorySnapshots) => response.json(chatbotMemorySnapshots),
    () => response.status(400).json(result)
  );
});
export default router;
