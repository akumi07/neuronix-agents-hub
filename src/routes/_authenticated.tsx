import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/stores/auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

/**
 * Client-side session gate. Authorisation itself is enforced by the backend on
 * every request; this only keeps the UI from rendering signed-out shells.
 */
function AuthenticatedLayout() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) void navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Checking your session…</span>
      </div>
    );
  }

  return (
    <AppShell>
      {/* Required: nested routes render here. */}
      <Outlet />
    </AppShell>
  );
}
