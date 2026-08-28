import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusIndicator";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatDuration, formatPercent } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { agentService } from "@/services/agentService";

export const Route = createFileRoute("/_authenticated/agents/$agentId")({
  head: () => ({
    meta: [
      { title: "Agent detail — NeuronixAI" },
      { name: "description", content: "Inspect a NeuronixAI agent's role, tools and performance." },
      { property: "og:title", content: "Agent detail — NeuronixAI" },
      { property: "og:description", content: "Role, capabilities, tools and metrics for one agent." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgentDetailPage,
});

function AgentDetailPage() {
  const { agentId } = Route.useParams();
  const agent = useQuery({
    queryKey: queryKeys.agent(agentId),
    queryFn: () => agentService.get(agentId),
  });

  if (agent.error) {
    return (
      <div className="mx-auto max-w-3xl">
        <ErrorState error={agent.error} onRetry={() => void agent.refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/agents">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All agents
        </Link>
      </Button>

      {agent.isPending || !agent.data ? (
        <div className="panel h-64 animate-pulse" />
      ) : (
        <>
          <PageHeader
            eyebrow={agent.data.role}
            title={agent.data.name}
            description={agent.data.description}
            actions={<StatusBadge status={agent.data.status} />}
          />

          <section aria-label="Performance" className="grid gap-4 sm:grid-cols-3">
            {[
              ["Executions", String(agent.data.metrics.executions)],
              ["Success rate", formatPercent(agent.data.metrics.successRate)],
              ["Average duration", formatDuration(agent.data.metrics.avgDurationMs)],
            ].map(([label, value]) => (
              <div key={label} className="panel p-5">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
              </div>
            ))}
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="panel p-5">
              <h2 className="text-sm font-semibold">Capabilities</h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {agent.data.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel p-5">
              <h2 className="text-sm font-semibold">Tools</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {agent.data.tools.length === 0 ? (
                  <li>No tools attached.</li>
                ) : (
                  agent.data.tools.map((tool) => (
                    <li key={tool} className="font-mono text-xs">
                      {tool}
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>

          <section className="panel p-5">
            <h2 className="text-sm font-semibold">Configuration</h2>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Model</dt>
                <dd className="font-mono text-xs text-foreground">{agent.data.model}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Created</dt>
                <dd className="text-foreground">{formatDateTime(agent.data.createdAt)}</dd>
              </div>
            </dl>
          </section>
        </>
      )}
    </div>
  );
}
