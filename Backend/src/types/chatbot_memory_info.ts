import { ChatbotMemorySnapshot } from "@prisma/client";

export type ChatbotMemoryInfo = Omit<ChatbotMemorySnapshot, "id">;
