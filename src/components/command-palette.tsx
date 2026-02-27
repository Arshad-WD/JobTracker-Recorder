"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Archive,
  Settings,
  Phone,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/hooks/use-store";

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isCommandOpen, setCommandOpen, setQuickAddOpen, setQuickSearchOpen } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(!isCommandOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandOpen, setCommandOpen]);

  const runCommand = useCallback(
    (command: () => void) => {
      setCommandOpen(false);
      command();
    },
    [setCommandOpen]
  );

  return (
    <AnimatePresence>
      {isCommandOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
          >
            <Command className="rounded-xl border bg-popover shadow-2xl overflow-hidden">
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  placeholder="Type a command or search..."
                  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Quick Actions" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                  <Command.Item
                    onSelect={() => runCommand(() => setQuickAddOpen(true))}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Application
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => setQuickSearchOpen(true))}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <Phone className="h-4 w-4" />
                    Quick Search (Incoming Call)
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="my-1 h-px bg-border" />

                <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/dashboard"))}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/applications"))}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <Briefcase className="h-4 w-4" />
                    Applications
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/analytics"))}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/archived"))}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <Archive className="h-4 w-4" />
                    Archived
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/settings"))}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="my-1 h-px bg-border" />

                <Command.Group heading="Theme" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                  <Command.Item
                    onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    Toggle Theme
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
