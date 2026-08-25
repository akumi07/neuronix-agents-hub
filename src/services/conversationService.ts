import { apiRequest } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { Conversation } from "@/types/domain";

import { mockBackend } from "./mock/runtime";

export const conversationService = {
  list(): Promise<Conversation[]> {
    return env.isMockMode
      ? mockBackend.conversations()
      : apiRequest<Conversation[]>("/api/conversations");
  },
  archive(id: string): Promise<void> {
    return env.isMockMode
      ? mockBackend.archiveConversation(id)
      : apiRequest<void>(`/api/conversations/${id}/archive`, { method: "POST" });
  },
};
