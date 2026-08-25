import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
}

export function KpiCard({ label, value, hint, icon: Icon }: KpiCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <span className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
