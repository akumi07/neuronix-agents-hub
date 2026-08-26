import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { StatusBadge } from "@/components/shared/StatusIndicator";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Execution, ExecutionStep } from "@/types/domain";

/**
 * Multi-agent execution visualisation: an ordered chain of agents with live
 * status, current action and expandable per-agent detail.
 */
export function ExecutionFlow({ execution }: { execution: Execution }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 pl-1">
        <span className="rounded-md border border-border-strong bg-surface px-2 py-1 font-mono text-xs text-muted-foreground">
          User task
        </span>
        <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{execution.taskTitle}</p>
      </div>
      <Connector active={execution.status === "running"} />
      <ol className="space-y-2">
        {execution.steps.map((step, index) => (
          <li key={step.id}>
            <StepRow step={step} />
            {index < execution.steps.length - 1 ? (
              <Connector active={step.status === "running" || step.status === "thinking"} />
            ) : null}
          </li>
        ))}
      </ol>
      <Connector active={false} />
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
          execution.status === "completed"
            ? "border-success/35 bg-success/10 text-success"
            : execution.status === "failed"
              ? "border-destructive/35 bg-destructive/10 text-destructive"
              : "border-border bg-surface text-muted-foreground",
        )}
      >
        {execution.status === "completed"
          ? "Final result delivered"
          : execution.status === "failed"
            ? (execution.error ?? "Execution failed")
            : "Final result pending — agents are still working"}
      </div>
    </div>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <div className="ml-4 h-4 w-0.5" aria-hidden="true">
      <div className={cn("h-full w-full", active ? "animate-flow" : "bg-border")} />
    </div>
  );
}

function StepRow({ step }: { step: ExecutionStep }) {
  const [open, setOpen] = useState(false);
  const detailId = `step-detail-${step.id}`;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card transition-colors",
        step.status === "running" || step.status === "thinking"
          ? "border-primary/40 shadow-glow"
          : "border-border",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={detailId}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            {step.agentName}
            <span className="text-xs font-normal text-muted-foreground">{step.role}</span>
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{step.currentAction}</p>
        </div>
        <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">
          {formatDuration(step.durationMs)}
        </span>
        <StatusBadge status={step.status} />
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div id={detailId} className="space-y-2 border-t border-border px-3.5 py-3 text-xs">
          <DetailRow label="Duration" value={formatDuration(step.durationMs)} />
          <DetailRow label="Tools used" value={step.toolsUsed.length ? step.toolsUsed.join(", ") : "None"} />
          <div>
            <p className="text-muted-foreground">Output</p>
            <p className="mt-1 rounded-md border border-border bg-surface p-2.5 font-mono text-[11px] leading-relaxed text-foreground/85">
              {step.output ?? "No output recorded yet."}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground/85">{value}</span>
    </div>
  );
}
