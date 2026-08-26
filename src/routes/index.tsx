import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Gauge,
  KeyRound,
  ListChecks,
  Lock,
  Radar,
  ScrollText,
  Wrench,
} from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuronixAI — Agents that plan, reason and execute" },
      {
        name: "description",
        content:
          "NeuronixAI is a multi-agent workspace: describe an objective, watch agents plan, use tools and execute it, and inspect every step.",
      },
      { property: "og:title", content: "NeuronixAI — Agents that plan, reason and execute" },
      {
        property: "og:description",
        content:
          "A multi-agent productivity platform: give NeuronixAI an objective and follow every planning, tool and execution step.",
      },
    ],
  }),
  component: LandingPage,
});

const CAPABILITIES = [
  {
    icon: BrainCircuit,
    title: "Planning before action",
    body: "Every objective is decomposed into an ordered plan with explicit hand-offs, so work is traceable rather than opaque.",
  },
  {
    icon: Radar,
    title: "Live execution visibility",
    body: "Follow each agent's status, current action, duration and output as an execution progresses.",
  },
  {
    icon: Wrench,
    title: "Tool-using agents",
    body: "Agents call tools to retrieve, verify and transform information. New integrations plug into the same contract.",
  },
  {
    icon: ListChecks,
    title: "Task-centric workspace",
    body: "Pending, running, completed and failed work stays organised with the execution that produced it.",
  },
  {
    icon: ScrollText,
    title: "Auditable history",
    body: "Conversations and activity are retained separately, so you can review reasoning and events after the fact.",
  },
  {
    icon: Gauge,
    title: "Built for scale",
    body: "A Spring Boot and PostgreSQL core with a strictly typed client, ready for streaming execution events.",
  },
];

const PIPELINE = [
  { name: "Planner Agent", detail: "Decomposes the objective" },
  { name: "Research Agent", detail: "Gathers and cites sources" },
  { name: "Analysis Agent", detail: "Scores against your criteria" },
  { name: "Writer Agent", detail: "Produces the deliverable" },
  { name: "Review Agent", detail: "Audits before delivery" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav aria-label="Primary" className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Create account</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-aurora border-b border-border">
          <div className="bg-neural-grid">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
              <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/80 px-3 py-1 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary animate-status-pulse" aria-hidden="true" />
                Multi-agent orchestration console
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
                <span className="text-gradient-brand">Agents that plan, reason, use tools</span>{" "}
                <span className="text-foreground">and finish the work.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Describe an objective once. NeuronixAI builds the plan, routes each stage to a
                specialised agent, and shows you exactly what happened — step by step, with the
                evidence attached.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/register">
                    Start building
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Log in to your workspace</Link>
                </Button>
              </div>

              <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
                {[
                  ["Specialised agents", "6"],
                  ["Execution stages", "Traceable"],
                  ["Tool contract", "Extensible"],
                  ["Event delivery", "Streaming-ready"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
                    <dd className="mt-1 font-display text-lg font-semibold text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                The multi-agent model
              </p>
              <h2 className="mt-3 text-3xl font-semibold">One objective, a chain of specialists</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                A single general-purpose model handles a broad request poorly. NeuronixAI splits the
                work: a planner owns strategy, retrieval agents own evidence, analysis agents own
                judgement, and writers own the deliverable. Each hand-off is recorded, so the result
                is reviewable rather than a black box.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {[
                  "Every stage declares its role, tools and output.",
                  "Failures are isolated to a stage instead of the whole run.",
                  "New agents and tools extend the pipeline without redesign.",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Boxes className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Example workflow
              </p>
              <ol className="mt-4 space-y-0">
                {PIPELINE.map((stage, index) => (
                  <li key={stage.name}>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3.5 py-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary/15 font-mono text-xs text-primary">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">{stage.name}</span>
                        <span className="block text-xs text-muted-foreground">{stage.detail}</span>
                      </span>
                    </div>
                    {index < PIPELINE.length - 1 ? (
                      <div className="ml-[26px] h-3 w-0.5 bg-border" aria-hidden="true" />
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-3xl font-semibold">Capabilities</h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Built as a working console for agent execution — not a chat window with extra steps.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((capability) => (
                <div key={capability.title} className="panel p-5">
                  <span className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-primary">
                    <capability.icon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{capability.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{capability.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                Security and reliability
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Boring where it matters</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {[
                {
                  icon: Lock,
                  title: "Server-enforced authorisation",
                  body: "Access decisions are made by the backend. The client never grants itself permissions.",
                },
                {
                  icon: KeyRound,
                  title: "Hashed credentials",
                  body: "Passwords are stored using BCrypt. Sessions are token-based and revocable.",
                },
                {
                  icon: ScrollText,
                  title: "Versioned schema",
                  body: "PostgreSQL with Flyway migrations, so every environment converges on one schema.",
                },
                {
                  icon: Gauge,
                  title: "Recoverable executions",
                  body: "Failures are captured per stage with a clear reason, not a generic error screen.",
                },
              ].map((item) => (
                <div key={item.title} className="panel p-5">
                  <item.icon className="size-4 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-aurora">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
            <h2 className="text-3xl font-semibold sm:text-4xl">Give NeuronixAI something to accomplish</h2>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Create a workspace and run your first multi-agent task in a couple of minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/register">
                  Create your account
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo size="sm" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NeuronixAI. Multi-agent productivity and automation.
          </p>
          <nav aria-label="Footer" className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link to="/register" className="hover:text-foreground">
              Create account
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
