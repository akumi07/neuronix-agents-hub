import { apiRequest } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { Execution } from "@/types/domain";

import { mockBackend } from "./mock/runtime";

export const executionService = {
  list(): Promise<Execution[]> {
    return env.isMockMode ? mockBackend.executions() : apiRequest<Execution[]>("/api/executions");
  },
  get(id: string): Promise<Execution> {
    return env.isMockMode ? mockBackend.execution(id) : apiRequest<Execution>(`/api/executions/${id}`);
  },
};
