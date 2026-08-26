import { AlertTriangle, CheckCircle2, HelpCircle, ListChecks, Route, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatClockTime, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ActivityEvent, ActivityEventType } from "@/types/domain";

const ICONS: Record<ActivityEventType, LucideIcon> = {
  task_started: ListChecks,
  plan_created: Route,
  tool_used: Wrench,
  input_requested: HelpCircle,
  execution_completed: CheckCircle2,
  execution_failed: AlertTriangle,
};

const TONES: Record<ActivityEventType, string> = {
  task_started: "border-border-strong bg-surface text-muted-foreground",
  plan_created: "border-info/35 bg-info/12 text-info",
  tool_used: "border-primary/35 bg-primary/12 text-primary",
  input_requested: "border-warning/35 bg-warning/12 text-warning",
  execution_completed: "border-success/35 bg-success/12 text-success",
  execution_failed: "border-destructive/40 bg-destructive/12 text-destructive",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityEventType, string> = {
  task_started: "Task started",
  plan_created: "Plan created",
  tool_used: "Tool used",
  input_requested: "Input requested",
  execution_completed: "Execution completed",
  execution_failed: "Execution failed",
};

export function ActivityTimeline({
  events,
  className,
}: {
  events: ActivityEvent[];
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-1", className)}>
      {events.map((event, index) => {
        const Icon = ICONS[event.type];
        return (
          <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < events.length - 1 ? (
              <span
                className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-lg border",
                TONES[event.type],
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm text-foreground">{event.message}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                <span>{ACTIVITY_TYPE_LABELS[event.type]}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={event.createdAt}>{formatClockTime(event.createdAt)}</time>
                <span aria-hidden="true">·</span>
                <span>{formatRelativeTime(event.createdAt)}</span>
                {event.agentName ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-foreground/70">{event.agentName}</span>
                  </>
                ) : null}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
