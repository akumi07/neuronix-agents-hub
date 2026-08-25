import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toUserMessage } from "@/lib/api/errors";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({ error, onRetry, title = "We couldn't load this" }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="panel flex flex-col items-center gap-3 px-6 py-12 text-center"
    >
      <span className="grid size-11 place-items-center rounded-xl border border-destructive/35 bg-destructive/12 text-destructive">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{toUserMessage(error)}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RotateCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
