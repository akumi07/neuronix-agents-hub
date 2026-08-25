import { apiRequest } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { Agent, AgentDraft, AgentStatus } from "@/types/domain";

import { mockBackend } from "./mock/runtime";

export const agentService = {
  list(): Promise<Agent[]> {
    return env.isMockMode ? mockBackend.agents() : apiRequest<Agent[]>("/api/agents");
  },
  get(id: string): Promise<Agent> {
    return env.isMockMode ? mockBackend.agent(id) : apiRequest<Agent>(`/api/agents/${id}`);
  },
  create(draft: AgentDraft): Promise<Agent> {
    return env.isMockMode
      ? mockBackend.createAgent(draft)
      : apiRequest<Agent>("/api/agents", { method: "POST", body: draft });
  },
  setStatus(id: string, status: AgentStatus): Promise<Agent> {
    return env.isMockMode
      ? mockBackend.setAgentStatus(id, status)
      : apiRequest<Agent>(`/api/agents/${id}/status`, { method: "PATCH", body: { status } });
  },
};
