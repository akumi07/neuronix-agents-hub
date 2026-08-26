import { CornerDownLeft, Loader2, Paperclip, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Agent } from "@/types/domain";

export type ExecutionMode = "autonomous" | "review";

export interface TaskSubmission {
  objective: string;
  leadAgentId: string;
  mode: ExecutionMode;
}

interface TaskComposerProps {
  agents: Agent[];
  submitting: boolean;
  onSubmit: (submission: TaskSubmission) => void;
}

/**
 * Task composer — the primary input surface of the workspace. Attachment,
 * model and tool selection are architected but marked unavailable until the
 * backend exposes them.
 */
export function TaskComposer({ agents, submitting, onSubmit }: TaskComposerProps) {
  const selectable = agents.filter((agent) => agent.status !== "disabled");
  const [objective, setObjective] = useState("");
  const [leadAgentId, setLeadAgentId] = useState(selectable[0]?.id ?? "");
  const [mode, setMode] = useState<ExecutionMode>("autonomous");

  const canSubmit = objective.trim().length >= 8 && leadAgentId !== "" && !submitting;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({ objective: objective.trim(), leadAgentId, mode });
    setObjective("");
  };

  return (
    <form
      className="panel p-3 sm:p-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label htmlFor="composer-objective" className="sr-only">
        Task objective
      </label>
      <Textarea
        id="composer-objective"
        value={objective}
        onChange={(event) => setObjective(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            submit();
          }
        }}
        rows={3}
        placeholder="What would you like NeuronixAI to accomplish?"
        className="min-h-[88px] resize-none border-0 bg-transparent p-1 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <Select value={leadAgentId} onValueChange={setLeadAgentId}>
          <SelectTrigger className="h-8 w-[180px] text-xs" aria-label="Lead agent">
            <SelectValue placeholder="Lead agent" />
          </SelectTrigger>
          <SelectContent>
            {selectable.map((agent) => (
              <SelectItem key={agent.id} value={agent.id} className="text-xs">
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={mode} onValueChange={(value) => setMode(value as ExecutionMode)}>
          <SelectTrigger className="h-8 w-[168px] text-xs" aria-label="Execution mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="autonomous" className="text-xs">
              Autonomous run
            </SelectItem>
            <SelectItem value="review" className="text-xs">
              Pause for review
            </SelectItem>
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="size-8" disabled aria-label="Attach a file (coming soon)">
              <Paperclip className="size-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Attachments are coming soon</TooltipContent>
        </Tooltip>

        <span className="ml-auto hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">⌘</kbd>
          <CornerDownLeft className="size-3" aria-hidden="true" />
          to run
        </span>

        <Button type="submit" size="sm" disabled={!canSubmit}>
          {submitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {submitting ? "Dispatching…" : "Run task"}
        </Button>
      </div>
    </form>
  );
}
