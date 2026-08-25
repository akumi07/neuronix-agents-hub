import { apiRequest } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { ActivityEvent } from "@/types/domain";

import { mockBackend } from "./mock/runtime";

export const activityService = {
  list(): Promise<ActivityEvent[]> {
    return env.isMockMode ? mockBackend.activity() : apiRequest<ActivityEvent[]>("/api/activity");
  },
};
