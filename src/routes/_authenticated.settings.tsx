import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/lib/env";
import { formatDateTime } from "@/lib/format";
import { useAuth } from "@/stores/auth";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NeuronixAI" },
      { name: "description", content: "Manage your NeuronixAI account and workspace connection." },
      { property: "og:title", content: "Settings — NeuronixAI" },
      { property: "og:description", content: "Account details and API connection status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Your profile and how this frontend is talking to the NeuronixAI backend."
      />

      <section className="panel p-5">
        <h2 className="text-sm font-semibold">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings-name">Display name</Label>
            <Input id="settings-name" value={user?.displayName ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" value={user?.email ?? ""} readOnly />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Profile editing is handled by the backend account endpoints and isn't exposed yet.
          {user ? ` Member since ${formatDateTime(user.createdAt)}.` : ""}
        </p>
      </section>

      <section className="panel p-5">
        <h2 className="text-sm font-semibold">Backend connection</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Mode</dt>
            <dd className="text-foreground">
              {env.isMockMode ? "Demo data (no API configured)" : "Live API"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">API base URL</dt>
            <dd className="font-mono text-xs text-foreground">{env.apiBaseUrl || "not set"}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          Set <code className="font-mono">VITE_API_BASE_URL</code> to point this frontend at your
          Spring Boot deployment. Every service call switches over without UI changes.
        </p>
      </section>

      <section className="panel p-5">
        <h2 className="text-sm font-semibold">Session</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Logging out clears the stored token from this browser.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            logout();
            void navigate({ to: "/login", replace: true });
          }}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Log out
        </Button>
      </section>
    </div>
  );
}
