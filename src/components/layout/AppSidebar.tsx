import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessagesSquare,
  Settings,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/auth";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workspace", label: "AI Workspace", icon: Sparkles },
  { to: "/agents", label: "Agents", icon: Bot },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/conversations", label: "Conversations", icon: MessagesSquare },
  { to: "/tools", label: "Tools", icon: Wrench },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export function AppSidebar({ collapsed, onNavigate }: AppSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-0")}>
        <Link to="/dashboard" aria-label="NeuronixAI dashboard" onClick={onNavigate}>
          <Logo showWordmark={!collapsed} size="sm" />
        </Link>
      </div>

      <nav aria-label="Main" className="scroll-thin flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-0",
                )}
                activeProps={{
                  className:
                    "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--sidebar-primary)]",
                }}
              >
                <item.icon className="size-4 shrink-0" aria-hidden="true" />
                {collapsed ? <span className="sr-only">{item.label}</span> : <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {collapsed ? (
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out" className="mx-auto">
            <LogOut className="size-4" aria-hidden="true" />
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/60 px-3 py-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {(user?.displayName ?? "N").slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-sidebar-foreground">
                  {user?.displayName ?? "Signed in"}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
              </span>
            </div>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={logout}>
              <LogOut className="size-4" aria-hidden="true" />
              Log out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
