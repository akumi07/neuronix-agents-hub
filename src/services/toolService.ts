import { apiRequest } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { Tool } from "@/types/domain";

import { mockBackend } from "./mock/runtime";

export const toolService = {
  list(): Promise<Tool[]> {
    return env.isMockMode ? mockBackend.tools() : apiRequest<Tool[]>("/api/tools");
  },
};
