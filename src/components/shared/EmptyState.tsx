import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="panel bg-neural-grid flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-xl border border-border-strong bg-surface text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
