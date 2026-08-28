import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { useState } from "react";

import { ACTIVITY_TYPE_LABELS, ActivityTimeline } from "@/components/activity/ActivityTimeline";
import { RowSkeletonList } from "@/components/shared/CardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { queryKeys } from "@/lib/query-keys";
import { activityService } from "@/services/activityService";
import { cn } from "@/lib/utils";
import type { ActivityEventType } from "@/types/domain";

export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({
    meta: [
      { title: "Activity — NeuronixAI" },
      {
        name: "description",
        content: "A chronological feed of plans, tool calls and execution outcomes from your agents.",
      },
      { property: "og:title", content: "Activity — NeuronixAI" },
      { property: "og:description", content: "Audit every event your NeuronixAI agents produced." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ActivityPage,
});

const TYPES = Object.keys(ACTIVITY_TYPE_LABELS) as ActivityEventType[];

function ActivityPage() {
  const activity = useQuery({ queryKey: queryKeys.activity, queryFn: activityService.list });
  const [type, setType] = useState<ActivityEventType | "all">("all");

  const visible = (activity.data ?? []).filter((event) => type === "all" || event.type === type);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Audit trail"
        title="Activity"
        description="Everything your agents did, in order, with the agent and task attached."
      />

      <div role="tablist" aria-label="Filter activity by type" className="flex flex-wrap gap-1.5">
        {(["all", ...TYPES] as Array<ActivityEventType | "all">).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={type === option}
            onClick={() => setType(option)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              type === option
                ? "border-primary/45 bg-primary/12 text-primary"
                : "border-border bg-surface text-muted-foreground hover:border-border-strong",
            )}
          >
            {option === "all" ? "All events" : ACTIVITY_TYPE_LABELS[option]}
          </button>
        ))}
      </div>

      <section className="panel p-5">
        {activity.isPending ? (
          <RowSkeletonList count={8} />
        ) : activity.error ? (
          <ErrorState error={activity.error} onRetry={() => void activity.refetch()} />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No events"
            description="Run a task and agent events will stream in here."
          />
        ) : (
          <ActivityTimeline events={visible} />
        )}
      </section>
    </div>
  );
}
