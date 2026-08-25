import { ApiError } from "@/lib/api/errors";
import type {
  ActivityEvent,
  Agent,
  AgentDraft,
  Conversation,
  Execution,
  Task,
  User,
} from "@/types/domain";

import * as seed from "./dataset";

/**
 * In-memory mock backend. Used only when VITE_API_BASE_URL is not configured.
 * Mirrors the shape of the Spring Boot API so services can switch transport
 * without touching the UI.
 */

const KNOWN_ACCOUNT = "akash@neuronix.ai";

interface MockState {
  users: Array<{ email: string; password: string; displayName: string; createdAt: string }>;
  agents: Agent[];
  tasks: Task[];
  executions: Execution[];
  activity: ActivityEvent[];
  conversations: Conversation[];
}

const state: MockState = {
  users: [
    {
      email: KNOWN_ACCOUNT,
      password: "neuronix2026",
      displayName: "Akash",
      createdAt: new Date(Date.UTC(2026, 6, 15)).toISOString(),
    },
  ],
  agents: [...seed.agents],
  tasks: [...seed.tasks],
  executions: [...seed.executions],
  activity: [...seed.activity],
  conversations: [...seed.conversations],
};

export const latency = (ms = 420) => new Promise((resolve) => setTimeout(resolve, ms));

function displayNameFor(email: string): string {
  const local = email.split("@")[0] ?? "there";
  return local.charAt(0).toUpperCase() + local.slice(1).replace(/[._-]+/g, " ");
}

function toUser(email: string, displayName: string, createdAt: string): User {
  return { id: `usr_${email}`, email, displayName, createdAt };
}

export const mockBackend = {
  async login(email: string, password: string) {
    await latency();
    const account = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!account || account.password !== password) {
      throw new ApiError({
        status: 401,
        kind: "unauthorized",
        message: "That email and password combination doesn't match an account.",
      });
    }
    return {
      token: `mock.${btoa(account.email)}`,
      user: toUser(account.email, account.displayName, account.createdAt),
    };
  },

  async register(email: string, password: string) {
    await latency(600);
    if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new ApiError({
        status: 409,
        kind: "conflict",
        message: "An account with this email already exists.",
      });
    }
    const account = {
      email,
      password,
      displayName: displayNameFor(email),
      createdAt: new Date().toISOString(),
    };
    state.users.push(account);
    return {
      token: `mock.${btoa(account.email)}`,
      user: toUser(account.email, account.displayName, account.createdAt),
    };
  },

  async currentUser(email: string) {
    await latency(150);
    const account = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!account) {
      throw new ApiError({ status: 401, kind: "unauthorized", message: "Session no longer valid." });
    }
    return toUser(account.email, account.displayName, account.createdAt);
  },

  async agents() {
    await latency();
    return [...state.agents];
  },

  async agent(id: string) {
    await latency(280);
    const found = state.agents.find((a) => a.id === id);
    if (!found) {
      throw new ApiError({ status: 404, kind: "not_found", message: "This agent no longer exists." });
    }
    return found;
  },

  async createAgent(draft: AgentDraft) {
    await latency(600);
    const agent: Agent = {
      id: `agt_${Math.random().toString(36).slice(2, 8)}`,
      name: draft.name,
      role: draft.role,
      description: draft.description,
      status: "idle",
      capabilities: draft.capabilities,
      tools: [],
      model: "neuronix-plan-1",
      createdAt: new Date().toISOString(),
      metrics: { executions: 0, successRate: 0, avgDurationMs: 0 },
    };
    state.agents = [agent, ...state.agents];
    return agent;
  },

  async setAgentStatus(id: string, status: Agent["status"]) {
    await latency(300);
    state.agents = state.agents.map((a) => (a.id === id ? { ...a, status } : a));
    const updated = state.agents.find((a) => a.id === id);
    if (!updated) {
      throw new ApiError({ status: 404, kind: "not_found", message: "This agent no longer exists." });
    }
    return updated;
  },

  async tasks() {
    await latency();
    return [...state.tasks];
  },

  async createTask(title: string, agentIds: string[]) {
    await latency(700);
    const seq = 1025 + state.tasks.length;
    const task: Task = {
      id: `tsk_${seq}`,
      reference: `TSK-${seq}`,
      title,
      status: "pending",
      priority: "normal",
      agentIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      durationMs: null,
      executionId: null,
    };
    state.tasks = [task, ...state.tasks];
    state.activity = [
      {
        id: `act_${Math.random().toString(36).slice(2, 8)}`,
        type: "task_started",
        message: `Task ${task.reference} queued`,
        agentId: null,
        agentName: null,
        taskId: task.id,
        createdAt: task.createdAt,
      },
      ...state.activity,
    ];
    return task;
  },

  async executions() {
    await latency();
    return [...state.executions];
  },

  async execution(id: string) {
    await latency(260);
    const found = state.executions.find((e) => e.id === id);
    if (!found) {
      throw new ApiError({ status: 404, kind: "not_found", message: "This execution no longer exists." });
    }
    return found;
  },

  async activity() {
    await latency();
    return [...state.activity];
  },

  async conversations() {
    await latency();
    return state.conversations.filter((c) => !c.archived);
  },

  async archiveConversation(id: string) {
    await latency(300);
    state.conversations = state.conversations.map((c) =>
      c.id === id ? { ...c, archived: true } : c,
    );
  },

  async tools() {
    await latency(240);
    return [...seed.tools];
  },
};

export const demoCredentials = { email: KNOWN_ACCOUNT, password: "neuronix2026" };
