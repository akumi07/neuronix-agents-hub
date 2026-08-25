/** Shared domain model for the NeuronixAI frontend. */

export type AgentStatus = "active" | "idle" | "disabled";

export type ExecutionStepStatus =
  | "pending"
  | "thinking"
  | "running"
  | "waiting"
  | "completed"
  | "failed";

export type TaskStatus = "pending" | "running" | "completed" | "failed";

export type TaskPriority = "low" | "normal" | "high";

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthResult {
  token: string;
  user: User;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  capabilities: string[];
  tools: string[];
  model: string;
  createdAt: string;
  metrics: {
    executions: number;
    successRate: number;
    avgDurationMs: number;
  };
}

export interface AgentDraft {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
}

export interface Task {
  id: string;
  reference: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  agentIds: string[];
  createdAt: string;
  updatedAt: string;
  durationMs: number | null;
  executionId: string | null;
}

export interface ExecutionStep {
  id: string;
  agentId: string;
  agentName: string;
  role: string;
  status: ExecutionStepStatus;
  currentAction: string;
  durationMs: number | null;
  output: string | null;
  toolsUsed: string[];
}

export interface Execution {
  id: string;
  reference: string;
  taskId: string;
  taskTitle: string;
  status: TaskStatus;
  startedAt: string;
  durationMs: number | null;
  steps: ExecutionStep[];
  error: string | null;
}

export type ActivityEventType =
  | "task_started"
  | "plan_created"
  | "tool_used"
  | "input_requested"
  | "execution_completed"
  | "execution_failed";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  message: string;
  agentId: string | null;
  agentName: string | null;
  taskId: string | null;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  author: "user" | "agent";
  agentName?: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  agentNames: string[];
  messageCount: number;
  updatedAt: string;
  archived: boolean;
  messages: ConversationMessage[];
}

export type ToolAvailability = "available" | "coming_soon";

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  availability: ToolAvailability;
}

export interface WorkspaceStats {
  activeAgents: number;
  tasksRunning: number;
  tasksCompleted: number;
  recentExecutions: number;
}
