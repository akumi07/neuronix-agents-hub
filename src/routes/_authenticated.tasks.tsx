import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { useState } from "react";

import { RowSkeletonList } from "@/components/shared/CardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDuration, formatRelativeTime } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { taskService } from "@/services/taskService";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/domain";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — NeuronixAI" },
      {
        name: "description",
        content: "Track every NeuronixAI task: pending, running, completed and failed work.",
      },
      { property: "og:title", content: "Tasks — NeuronixAI" },
      { property: "og:description", content: "Filter and review the work your agents have run." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TasksPage,
});

const FILTERS: Array<{ value: TaskStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

function TasksPage() {
  const tasks = useQuery({ queryKey: queryKeys.tasks, queryFn: taskService.list });
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [search, setSearch] = useState("");

  const visible = (tasks.data ?? []).filter((task) => {
    const statusMatch = filter === "all" || task.status === filter;
    const term = search.trim().toLowerCase();
    const textMatch =
      term === "" ||
      task.title.toLowerCase().includes(term) ||
      task.reference.toLowerCase().includes(term);
    return statusMatch && textMatch;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Work log"
        title="Tasks"
        description="Every objective you've dispatched, with the execution that produced the result."
        actions={
          <Button asChild>
            <Link to="/workspace">New task</Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div role="tablist" aria-label="Filter tasks by status" className="flex flex-wrap gap-1.5">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === option.value
                  ? "border-primary/45 bg-primary/12 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:border-border-strong",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto sm:w-64">
          <label htmlFor="task-search" className="sr-only">
            Search tasks
          </label>
          <Input
            id="task-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or reference"
            className="h-9"
          />
        </div>
      </div>

      {tasks.isPending ? (
        <RowSkeletonList count={6} />
      ) : tasks.error ? (
        <ErrorState error={tasks.error} onRetry={() => void tasks.refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No matching tasks"
          description="Adjust the filters, or dispatch a new objective from the workspace."
          action={
            <Button asChild size="sm">
              <Link to="/workspace">Open workspace</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {visible.map((task) => (
            <li key={task.id} className="panel flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {task.reference} · {task.priority} priority · updated{" "}
                  {formatRelativeTime(task.updatedAt)}
                </p>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatDuration(task.durationMs)}
              </span>
              <StatusBadge status={task.status} />
              {task.executionId ? (
                <Button asChild variant="outline" size="sm">
                  <Link to="/workspace">View run</Link>
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
