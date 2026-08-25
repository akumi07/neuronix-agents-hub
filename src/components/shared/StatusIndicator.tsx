import { cn } from "@/lib/utils";
import type { AgentStatus, ExecutionStepStatus, TaskStatus } from "@/types/domain";

type AnyStatus = AgentStatus | ExecutionStepStatus | TaskStatus;

const LABELS: Record<AnyStatus, string> = {
  active: "Active",
  idle: "Idle",
  disabled: "Disabled",
  pending: "Pending",
  thinking: "Thinking",
  running: "Running",
  waiting: "Waiting",
  completed: "Completed",
  failed: "Failed",
};

const TONE: Record<AnyStatus, string> = {
  active: "border-success/35 bg-success/12 text-success",
  idle: "border-border-strong bg-muted text-muted-foreground",
  disabled: "border-border bg-muted/60 text-muted-foreground",
  pending: "border-border-strong bg-muted text-muted-foreground",
  thinking: "border-info/35 bg-info/12 text-info",
  running: "border-primary/35 bg-primary/12 text-primary",
  waiting: "border-warning/35 bg-warning/12 text-warning",
  completed: "border-success/35 bg-success/12 text-success",
  failed: "border-destructive/40 bg-destructive/12 text-destructive",
};

const LIVE: AnyStatus[] = ["running", "thinking", "active"];

export function statusLabel(status: AnyStatus): string {
  return LABELS[status];
}

export function StatusDot({ status, className }: { status: AnyStatus; className?: string }) {
  return (
    <span
      className={cn(
        "size-2 shrink-0 rounded-full bg-current",
        LIVE.includes(status) && "animate-status-pulse",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function StatusBadge({
  status,
  className,
  label,
}: {
  status: AnyStatus;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONE[status],
        className,
      )}
    >
      <StatusDot status={status} />
      {label ?? LABELS[status]}
    </span>
  );
}
