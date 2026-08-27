import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Radar, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ExecutionFlow } from "@/components/execution/ExecutionFlow";
import { CardSkeletonGrid, RowSkeletonList } from "@/components/shared/CardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusIndicator";
import { TaskComposer, type TaskSubmission } from "@/components/workspace/TaskComposer";
import { formatDuration, formatRelativeTime } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { toUserMessage } from "@/lib/api/errors";
import { agentService } from "@/services/agentService";
import { executionEvents } from "@/services/executionEventSource";
import { executionService } from "@/services/executionService";
import { taskService } from "@/services/taskService";
import { cn } from "@/lib/utils";
import type { Execution } from "@/types/domain";

export const Route = createFileRoute("/_authenticated/workspace")({
  head: () => ({
    meta: [
      { title: "AI Workspace — NeuronixAI" },
      {
        name: "description",
        content: "Dispatch objectives to NeuronixAI agents and watch each execution step unfold.",
      },
      { property: "og:title", content: "AI Workspace — NeuronixAI" },
      { property: "og:description", content: "The NeuronixAI multi-agent execution console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkspacePage,
});

function WorkspacePage() {
  const queryClient = useQueryClient();
  const agents = useQuery({ queryKey: queryKeys.agents, queryFn: agentService.list });
  const executions = useQuery({ queryKey: queryKeys.executions, queryFn: executionService.list });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [live, setLive] = useState<Execution | null>(null);

  const list = executions.data ?? [];
  const activeId = selectedId ?? list[0]?.id ?? null;
  const selected = live?.id === activeId ? live : (list.find((item) => item.id === activeId) ?? null);

  // Live execution updates arrive through the transport abstraction, so
  // swapping polling for SSE later needs no change here.
  useEffect(() => {
    if (!activeId) return;
    return executionEvents.subscribe(activeId, ({ execution }) => setLive(execution));
  }, [activeId]);

  const createTask = useMutation({
    mutationFn: (submission: TaskSubmission) =>
      taskService.create({ title: submission.objective, agentIds: [submission.leadAgentId] }),
    onSuccess: async (task) => {
      toast.success("Task dispatched", { description: `${task.reference} — agents are planning now.` });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks }),
        queryClient.invalidateQueries({ queryKey: queryKeys.executions }),
        queryClient.invalidateQueries({ queryKey: queryKeys.activity }),
      ]);
      if (task.executionId) setSelectedId(task.executionId);
    },
    onError: (error) => toast.error("Couldn't dispatch task", { description: toUserMessage(error) }),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        eyebrow="AI workspace"
        title="Multi-agent command centre"
        description="Give NeuronixAI an objective. The planner decomposes it, specialists execute it, and every step stays inspectable."
      />

      {agents.isPending ? (
        <div className="panel h-40 animate-pulse" />
      ) : agents.error ? (
        <ErrorState error={agents.error} onRetry={() => void agents.refetch()} />
      ) : (
        <TaskComposer
          agents={agents.data ?? []}
          submitting={createTask.isPending}
          onSubmit={(submission) => createTask.mutate(submission)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <section aria-labelledby="execution-list" className="panel p-4 lg:col-span-2">
          <h2 id="execution-list" className="text-base font-semibold">
            Executions
          </h2>
          <div className="mt-3">
            {executions.isPending ? (
              <RowSkeletonList count={4} />
            ) : executions.error ? (
              <ErrorState error={executions.error} onRetry={() => void executions.refetch()} />
            ) : list.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No executions yet"
                description="Run a task above to see the agent chain in action."
              />
            ) : (
              <ul className="space-y-2">
                {list.map((execution) => (
                  <li key={execution.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(execution.id)}
                      aria-current={execution.id === activeId}
                      className={cn(
                        "w-full rounded-lg border px-3.5 py-3 text-left transition-colors",
                        execution.id === activeId
                          ? "border-primary/45 bg-primary/8"
                          : "border-border bg-surface hover:border-border-strong",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                          {execution.taskTitle}
                        </span>
                        <StatusBadge status={execution.status} />
                      </span>
                      <span className="mt-1 block font-mono text-xs text-muted-foreground">
                        {execution.reference} · {formatRelativeTime(execution.startedAt)} ·{" "}
                        {formatDuration(execution.durationMs)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section aria-labelledby="execution-detail" className="panel p-4 lg:col-span-3">
          <div className="flex items-center justify-between gap-3">
            <h2 id="execution-detail" className="text-base font-semibold">
              Execution flow
            </h2>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Radar className="size-3.5" aria-hidden="true" />
              live via {executionEvents.transport}
            </span>
          </div>
          <div className="mt-4">
            {executions.isPending ? (
              <CardSkeletonGrid count={3} />
            ) : selected ? (
              <ExecutionFlow execution={selected} />
            ) : (
              <EmptyState
                icon={Radar}
                title="Select an execution"
                description="Pick a run to inspect each agent's status, tools and output."
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
