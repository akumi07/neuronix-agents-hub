import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { NAV_ITEMS } from "@/components/layout/AppSidebar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

/** Global quick-action interface, opened with Cmd/Ctrl + K. */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Quick actions">
      <CommandInput placeholder="Jump to a page or start a task…" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.to}
              value={item.label}
              onSelect={() => {
                onOpenChange(false);
                void navigate({ to: item.to });
              }}
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
