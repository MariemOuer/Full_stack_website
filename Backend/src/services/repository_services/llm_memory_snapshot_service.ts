import { LLMMemorySnapshotRepository } from "../../repositories/interfaces/llm_memory_snapshot_repository";
import { ChatbotMemorySnapshot } from "@prisma/client";
import { Result } from "../../utils/result/result";
import { ChatbotMemoryInfo } from "../../types/chatbot_memory_info";

export class LLMMemorySnapshotService {
  private llmMemorySnapshotRepository: LLMMemorySnapshotRepository;

  constructor({ llmMemorySnapshotRepository }: { llmMemorySnapshotRepository: LLMMemorySnapshotRepository }) {
    this.llmMemorySnapshotRepository = llmMemorySnapshotRepository;
  }

  async getAllMemorySnapshots(): Promise<Result<ChatbotMemorySnapshot[]>> {
    return await this.llmMemorySnapshotRepository.getAllMemorySnapshots();
  }

  async createMemorySnapshot(chatbotMemoryInfo: ChatbotMemoryInfo): Promise<Result<ChatbotMemorySnapshot>> {
    return await this.llmMemorySnapshotRepository.createMemorySnapshot(chatbotMemoryInfo);
  }
}
