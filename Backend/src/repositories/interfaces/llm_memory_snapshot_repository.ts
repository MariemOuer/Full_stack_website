import { ChatbotMemorySnapshot } from "@prisma/client";
import { Result } from "../../utils/result/result";

export interface LLMMemorySnapshotRepository {
  createMemorySnapshot(memorySnapshotInfo: Omit<ChatbotMemorySnapshot, "id">): Promise<Result<ChatbotMemorySnapshot>>;
  getAllMemorySnapshots(): Promise<Result<ChatbotMemorySnapshot[]>>;
}
