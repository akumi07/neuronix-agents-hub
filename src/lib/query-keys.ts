export const queryKeys = {
  agents: ["agents"] as const,
  agent: (id: string) => ["agents", id] as const,
  tasks: ["tasks"] as const,
  executions: ["executions"] as const,
  execution: (id: string) => ["executions", id] as const,
  activity: ["activity"] as const,
  conversations: ["conversations"] as const,
  tools: ["tools"] as const,
};
