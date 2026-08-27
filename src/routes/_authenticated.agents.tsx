import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Bot, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CardSkeletonGrid } from "@/components/shared/CardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusIndicator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toUserMessage } from "@/lib/api/errors";
import { formatDuration, formatPercent } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { agentService } from "@/services/agentService";
import type { Agent } from "@/types/domain";

export const Route = createFileRoute("/_authenticated/agents")({
  head: () => ({
    meta: [
      { title: "Agents — NeuronixAI" },
      {
        name: "description",
        content: "Configure the specialised NeuronixAI agents that plan, research, analyse and execute.",
      },
      { property: "og:title", content: "Agents — NeuronixAI" },
      { property: "og:description", content: "Manage your NeuronixAI agent roster and capabilities." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  const queryClient = useQueryClient();
  const agents = useQuery({ queryKey: queryKeys.agents, queryFn: agentService.list });
  const [creating, setCreating] = useState(false);

  const toggle = useMutation({
    mutationFn: ({ agent, enabled }: { agent: Agent; enabled: boolean }) =>
      agentService.setStatus(agent.id, enabled ? "active" : "disabled"),
    onSuccess: async (agent) => {
      toast.success(`${agent.name} is now ${agent.status}`);
      await queryClient.invalidateQueries({ queryKey: queryKeys.agents });
    },
    onError: (error) => toast.error("Couldn't update agent", { description: toUserMessage(error) }),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Roster"
        title="Agents"
        description="Each agent owns one stage of the pipeline with its own role, tools and model."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" aria-hidden="true" />
            New agent
          </Button>
        }
      />

      {agents.isPending ? (
        <CardSkeletonGrid count={6} />
      ) : agents.error ? (
        <ErrorState error={agents.error} onRetry={() => void agents.refetch()} />
      ) : (agents.data ?? []).length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No agents configured"
          description="Create your first agent to start building a pipeline."
          action={<Button onClick={() => setCreating(true)}>New agent</Button>}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(agents.data ?? []).map((agent) => (
            <li key={agent.id} className="panel flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-foreground">
                    <Link
                      to="/agents/$agentId"
                      params={{ agentId: agent.id }}
                      className="hover:text-primary"
                    >
                      {agent.name}
                    </Link>
                  </h2>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
                <StatusBadge status={agent.status} />
              </div>

              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{agent.description}</p>

              <ul className="mt-3 flex flex-wrap gap-1.5">
                {agent.capabilities.slice(0, 3).map((capability) => (
                  <li
                    key={capability}
                    className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {capability}
                  </li>
                ))}
              </ul>

              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Runs</dt>
                  <dd className="tabular-nums text-foreground">{agent.metrics.executions}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Success</dt>
                  <dd className="tabular-nums text-foreground">
                    {formatPercent(agent.metrics.successRate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Avg</dt>
                  <dd className="tabular-nums text-foreground">
                    {formatDuration(agent.metrics.avgDurationMs)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
                <Label htmlFor={`enable-${agent.id}`} className="text-xs font-normal text-muted-foreground">
                  Enabled
                </Label>
                <Switch
                  id={`enable-${agent.id}`}
                  checked={agent.status !== "disabled"}
                  disabled={toggle.isPending}
                  onCheckedChange={(enabled) => toggle.mutate({ agent, enabled })}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <CreateAgentDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}

function CreateAgentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [capabilities, setCapabilities] = useState("");

  const create = useMutation({
    mutationFn: () =>
      agentService.create({
        name: name.trim(),
        role: role.trim(),
        description: description.trim(),
        capabilities: capabilities
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      }),
    onSuccess: async (agent) => {
      toast.success(`${agent.name} created`);
      await queryClient.invalidateQueries({ queryKey: queryKeys.agents });
      onOpenChange(false);
      setName("");
      setRole("");
      setDescription("");
      setCapabilities("");
    },
    onError: (error) => toast.error("Couldn't create agent", { description: toUserMessage(error) }),
  });

  const valid = name.trim().length >= 2 && role.trim().length >= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New agent</DialogTitle>
          <DialogDescription>
            Define a specialist. Roles keep responsibilities narrow, which makes runs easier to audit.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) create.mutate();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="agent-name">Name</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Compliance Agent"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent-role">Role</Label>
            <Input
              id="agent-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Policy reviewer"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent-description">Description</Label>
            <Textarea
              id="agent-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What this agent is responsible for."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent-capabilities">Capabilities</Label>
            <Input
              id="agent-capabilities"
              value={capabilities}
              onChange={(event) => setCapabilities(event.target.value)}
              placeholder="Comma separated, e.g. Risk scoring, Citation checks"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!valid || create.isPending}>
              {create.isPending ? "Creating…" : "Create agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
