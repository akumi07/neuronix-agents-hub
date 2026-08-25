import { apiRequest } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { Task } from "@/types/domain";

import { mockBackend } from "./mock/runtime";

export interface CreateTaskInput {
  title: string;
  agentIds: string[];
}

export const taskService = {
  list(): Promise<Task[]> {
    return env.isMockMode ? mockBackend.tasks() : apiRequest<Task[]>("/api/tasks");
  },
  create(input: CreateTaskInput): Promise<Task> {
    return env.isMockMode
      ? mockBackend.createTask(input.title, input.agentIds)
      : apiRequest<Task>("/api/tasks", { method: "POST", body: input });
  },
};
