import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toUserMessage } from "@/lib/api/errors";
import { useAuth } from "@/stores/auth";

import { AuthLayout } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — NeuronixAI" },
      {
        name: "description",
        content: "Create a NeuronixAI workspace and run your first multi-agent task.",
      },
      { property: "og:title", content: "Create your account — NeuronixAI" },
      {
        property: "og:description",
        content: "Set up your NeuronixAI workspace and start orchestrating AI agents.",
      },
    ],
  }),
  component: RegisterPage,
});

function passwordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^\w\s]/.test(password)) score += 1;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] ?? "Weak" };
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const strength = passwordStrength(password);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Use at least 8 characters for your password.");
    if (password !== confirm) return setError("Passwords don't match.");

    setSubmitting(true);
    try {
      await register({ email: email.trim(), password });
      await navigate({ to: "/dashboard" });
    } catch (cause) {
      setError(toUserMessage(cause));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="One objective in, a coordinated agent run out."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            aria-describedby="password-strength"
            required
          />
          <div id="password-strength" className="flex items-center gap-2">
            <div className="flex h-1 flex-1 gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={
                    index < strength.score
                      ? "h-full flex-1 rounded-full bg-primary"
                      : "h-full flex-1 rounded-full bg-border"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{strength.label}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Repeat your password"
            required
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {submitting ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Passwords are hashed server-side. Authorisation is always enforced by the backend.
        </p>
      </form>
    </AuthLayout>
  );
}
