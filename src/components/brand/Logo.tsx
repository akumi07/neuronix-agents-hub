import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md";
}

/**
 * NeuronixAI mark: three linked nodes forming a directed path — intelligence
 * routed through agents into execution.
 */
export function Logo({ className, showWordmark = true, size = "md" }: LogoProps) {
  const box = size === "sm" ? "size-7" : "size-9";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid place-items-center rounded-lg border border-border-strong bg-surface",
          box,
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" strokeLinecap="round">
          <path d="M6 17.5 12 12l6-5.5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
          <path d="M6 6.5 12 12l6 5.5" stroke="var(--primary)" strokeWidth="1.5" />
          <circle cx="6" cy="6.5" r="2" fill="var(--primary)" />
          <circle cx="12" cy="12" r="2.4" fill="var(--primary)" />
          <circle cx="18" cy="17.5" r="2" fill="currentColor" fillOpacity="0.55" />
          <circle cx="6" cy="17.5" r="1.6" fill="currentColor" fillOpacity="0.35" />
          <circle cx="18" cy="6.5" r="1.6" fill="currentColor" fillOpacity="0.35" />
        </svg>
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "font-display font-semibold tracking-tight",
            size === "sm" ? "text-sm" : "text-base",
          )}
        >
          Neuronix<span className="text-primary">AI</span>
        </span>
      ) : null}
    </span>
  );
}
