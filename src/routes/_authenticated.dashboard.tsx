import { useQueries } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Activity, Bot, CheckCircle2, Play, Sparkles } from "lucide-react";

import { ActivityTimeline } from "@/components/activity/ActivityTimeline";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { CardSkeletonGrid, RowSkeletonList } from "@/components/shared/CardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusIndicator";
import { Button } from "@/components/ui/button";
import { formatDuration, formatRelativeTime, greetingFor } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { activityService } from "@/services/activityService";
import { agentService } from "@/services/agentService";
import { executionService } from "@/services/executionService";
import { taskService } from "@/services/taskService";
import { useAuth } from "@/stores/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NeuronixAI" },
      {
        name: "description",
        content: "Your NeuronixAI command centre: agent health, running tasks and recent activity.",
      },
      { property: "og:title", content: "Dashboard — NeuronixAI" },
      { property: "og:description", content: "Monitor agents, tasks and executions in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const [agents, tasks, executions, activity] = useQueries({
    queries: [
      { queryKey: queryKeys.agents, queryFn: agentService.list },
      { queryKey: queryKeys.tasks, queryFn: taskService.list },
      { queryKey: queryKeys.executions, queryFn: executionService.list },
      { queryKey: queryKeys.activity, queryFn: activityService.list },
    ],
  });

  const loading = agents.isPending || tasks.isPending || executions.isPending;
  const error = agents.error ?? tasks.error ?? executions.error;

  const taskList = tasks.data ?? [];
  const running = taskList.filter((task) => task.status === "running");
  const completed = taskList.filter((task) => task.status === "completed");

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        eyebrow={greetingFor()}
        title={user ? `${user.displayName}'s command centre` : "Command centre"}
        description="Live agent health, in-flight work and the events your agents have produced."
        actions={
          <Button asChild>
            <Link to="/workspace">
              <Sparkles className="size-4" aria-hidden="true" />
              New task
            </Link>
          </Button>
        }
      />

      {error ? (
        <ErrorState
          error={error}
          onRetry={() => {
            void agents.refetch();
            void tasks.refetch();
            void executions.refetch();
          }}
        />
      ) : loading ? (
        <CardSkeletonGrid count={4} />
      ) : (
        <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Active agents"
            value={(agents.data ?? []).filter((agent) => agent.status === "active").length}
            hint={`${(agents.data ?? []).length} configured in this workspace`}
            icon={Bot}
          />
          <KpiCard
            label="Tasks running"
            value={running.length}
            hint={running.length ? "Agents are working right now" : "Nothing in flight"}
            icon={Play}
          />
          <KpiCard
            label="Tasks completed"
            value={completed.length}
            hint="Delivered with a reviewable trail"
            icon={CheckCircle2}
          />
          <KpiCard
            label="Recent executions"
            value={(executions.data ?? []).length}
            hint="Full step-by-step history retained"
            icon={Activity}
          />
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <section aria-labelledby="active-tasks" className="panel p-5 lg:col-span-3">
          <div className="flex items-center justify-between gap-3">
            <h2 id="active-tasks" className="text-base font-semibold">
              Active tasks
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/tasks">View all</Link>
            </Button>
          </div>
          <div className="mt-4">
            {loading ? (
              <RowSkeletonList count={4} />
            ) : running.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No tasks running"
                description="Describe an objective in the workspace and NeuronixAI will plan and execute it."
                action={
                  <Button asChild size="sm">
                    <Link to="/workspace">Open workspace</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-2">
                {running.slice(0, 5).map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3.5 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {task.reference} · {formatRelativeTime(task.updatedAt)} ·{" "}
                        {formatDuration(task.durationMs)}
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section aria-labelledby="recent-activity" className="panel p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 id="recent-activity" className="text-base font-semibold">
              Recent activity
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/activity">View all</Link>
            </Button>
          </div>
          <div className="mt-4">
            {activity.isPending ? (
              <RowSkeletonList count={5} />
            ) : (activity.data ?? []).length === 0 ? (
              <EmptyState icon={Activity} title="No activity yet" description="Agent events appear here." />
            ) : (
              <ActivityTimeline events={(activity.data ?? []).slice(0, 6)} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
