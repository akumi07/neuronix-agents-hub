import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";

import { CardSkeletonGrid } from "@/components/shared/CardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { queryKeys } from "@/lib/query-keys";
import { toolService } from "@/services/toolService";

export const Route = createFileRoute("/_authenticated/tools")({
  head: () => ({
    meta: [
      { title: "Tools — NeuronixAI" },
      {
        name: "description",
        content: "The tool registry your NeuronixAI agents can call during an execution.",
      },
      { property: "og:title", content: "Tools — NeuronixAI" },
      { property: "og:description", content: "Browse available and upcoming agent integrations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const tools = useQuery({ queryKey: queryKeys.tools, queryFn: toolService.list });

  const grouped = (tools.data ?? []).reduce<Record<string, typeof tools.data>>((acc, tool) => {
    const bucket = acc[tool.category] ?? [];
    bucket.push(tool);
    acc[tool.category] = bucket;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Registry"
        title="Tools"
        description="Agents call these tools during an execution. Every integration implements the same contract."
      />

      {tools.isPending ? (
        <CardSkeletonGrid count={6} />
      ) : tools.error ? (
        <ErrorState error={tools.error} onRetry={() => void tools.refetch()} />
      ) : (tools.data ?? []).length === 0 ? (
        <EmptyState icon={Wrench} title="No tools registered" description="Integrations appear here." />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} aria-labelledby={`category-${category}`}>
              <h2
                id={`category-${category}`}
                className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
              >
                {category}
              </h2>
              <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(items ?? []).map((tool) => (
                  <li key={tool.id} className="panel p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-foreground">{tool.name}</h3>
                      <span
                        className={
                          tool.availability === "available"
                            ? "rounded-full border border-success/35 bg-success/12 px-2 py-0.5 text-xs text-success"
                            : "rounded-full border border-border-strong bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        }
                      >
                        {tool.availability === "available" ? "Available" : "Coming soon"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {tool.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
