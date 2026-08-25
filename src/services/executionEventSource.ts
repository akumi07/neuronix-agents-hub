import type { Execution } from "@/types/domain";

import { executionService } from "./executionService";

export interface ExecutionEvent {
  execution: Execution;
  receivedAt: number;
}

export type ExecutionEventListener = (event: ExecutionEvent) => void;

export interface ExecutionEventSource {
  subscribe(executionId: string, listener: ExecutionEventListener): () => void;
  readonly transport: "polling" | "sse" | "websocket";
}

/**
 * Transport abstraction for live execution updates.
 *
 * The backend does not expose a streaming endpoint yet, so the default
 * implementation polls. Swapping in an SSE/WebSocket implementation later only
 * requires another object satisfying `ExecutionEventSource` — no component
 * changes.
 */
export function createPollingExecutionEventSource(intervalMs = 4000): ExecutionEventSource {
  return {
    transport: "polling",
    subscribe(executionId, listener) {
      let cancelled = false;

      const tick = async () => {
        try {
          const execution = await executionService.get(executionId);
          if (!cancelled) listener({ execution, receivedAt: Date.now() });
        } catch {
          // Transient failures are ignored; the next tick retries.
        }
      };

      void tick();
      const handle = setInterval(tick, intervalMs);

      return () => {
        cancelled = true;
        clearInterval(handle);
      };
    },
  };
}

export const executionEvents = createPollingExecutionEventSource();
