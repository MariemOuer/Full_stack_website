import { ChatbotMemorySnapshot } from "@prisma/client";
import { Result } from "../../utils/result/result";
import { LLMMemorySnapshotRepository } from "../interfaces/llm_memory_snapshot_repository";
import { safeExecutePrismaOperation } from "../../utils/prisma/prisma_helpers";
import PRISMA from "../../utils/prisma/prisma_client";

class PrismaLLMMemorySnapshotRepository implements LLMMemorySnapshotRepository {
  async createMemorySnapshot(memorySnapshotInfo: Omit<ChatbotMemorySnapshot, "id">): Promise<Result<ChatbotMemorySnapshot>> {
    return await safeExecutePrismaOperation(() =>
      PRISMA.chatbotMemorySnapshot.create({
        data: {
          ...memorySnapshotInfo,
          event_timeline: JSON.stringify(memorySnapshotInfo.event_timeline) ?? undefined,
        },
      })
    );
  }
  async getAllMemorySnapshots(): Promise<Result<ChatbotMemorySnapshot[]>> {
    return await safeExecutePrismaOperation(() => PRISMA.chatbotMemorySnapshot.findMany());
  }
}

const PrismaLLMMemorySnapshotRepositoryInstance = new PrismaLLMMemorySnapshotRepository();

export default PrismaLLMMemorySnapshotRepositoryInstance;
