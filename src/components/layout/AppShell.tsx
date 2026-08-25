import { Link } from "@tanstack/react-router";
import { Menu, PanelLeftClose, PanelLeftOpen, Search, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { CommandPalette, useCommandPalette } from "@/components/layout/CommandPalette";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const palette = useCommandPalette();

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border transition-[width] duration-200 lg:block",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        <AppSidebar collapsed={collapsed} />
      </aside>

      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-200", collapsed ? "lg:pl-[68px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <AppSidebar collapsed={false} onNavigate={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="size-5" aria-hidden="true" />
            )}
          </Button>

          <button
            type="button"
            onClick={() => palette.setOpen(true)}
            className="ml-1 flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong sm:max-w-sm"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="truncate">Search or jump to…</span>
            <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {env.isMockMode ? (
              <span className="hidden items-center gap-1.5 rounded-full border border-warning/35 bg-warning/12 px-2.5 py-1 text-xs font-medium text-warning md:inline-flex">
                Demo data — API not connected
              </span>
            ) : null}
            <Button asChild size="sm">
              <Link to="/workspace">
                <Sparkles className="size-4" aria-hidden="true" />
                New task
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <CommandPalette open={palette.open} onOpenChange={palette.setOpen} />
    </div>
  );
}
