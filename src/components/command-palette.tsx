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
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
            onClick={() => setCommandOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-1/2 top-[15%] z-[70] w-full max-w-2xl -translate-x-1/2 p-4"
          >
            <div className="monolith-scanlines rounded-none" />
            <Command className="bg-black border-[3px] border-white shadow-[12px_12px_0px_#8B5CF6] overflow-hidden relative">
              {/* Terminal Header */}
              <div className="bg-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-black/20" />
                    <div className="w-2 h-2 rounded-full bg-black/20" />
                    <div className="w-2 h-2 rounded-full bg-black/20" />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-[0.2em] text-black">
                    SYSTEM_ACCESS_v4.2 // JOBSNAP_TERMINAL
                  </span>
                </div>
                <span className="font-mono text-[8px] text-black/40 uppercase">
                  AUTH_SECURED: 0x8F2
                </span>
              </div>

              <div className="flex items-center border-b-[2px] border-white/10 px-6 py-4 bg-black/50">
                <Search className="mr-4 h-5 w-5 shrink-0 text-[#8B5CF6]" />
                <Command.Input
                  placeholder="EXECUTE_COMMAND_OR_SEARCH_QUERY..."
                  className="flex h-12 w-full bg-transparent py-4 font-mono text-sm uppercase tracking-widest text-white outline-none placeholder:text-white/20"
                />
              </div>

              <Command.List className="max-h-[450px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
                <Command.Empty className="py-12 text-center">
                   <div className="font-mono text-[10px] text-[#EF4444] uppercase tracking-widest leading-relaxed">
                      [ERROR]: NO_MATCHING_COMMANDS_FOUND_IN_DATA_STREAM
                   </div>
                </Command.Empty>

                <Command.Group 
                  heading="CORE_OPERATIONS" 
                  className="p-2 font-mono text-[8px] font-black uppercase tracking-[0.4em] text-[#8B5CF6] mb-2"
                >
                  <Command.Item
                    onSelect={() => runCommand(() => setQuickAddOpen(true))}
                    className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-all aria-selected:bg-[#22C55E] aria-selected:text-black hover:bg-white/5 group"
                  >
                    <Plus className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest">DEPLOY_NEW_TARGET [ADD]</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => setQuickSearchOpen(true))}
                    className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-all aria-selected:bg-[#22C55E] aria-selected:text-black hover:bg-white/5 group"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest">QUICK_INTERCEPT [SEARCH]</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group 
                  heading="NAVIGATION_LINKS" 
                  className="p-2 font-mono text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mt-4 mb-2"
                >
                  {[
                    { label: "DASHBOARD_OVERVIEW", href: "/dashboard", icon: LayoutDashboard },
                    { label: "ACTIVE_APPLICATIONS", href: "/applications", icon: Briefcase },
                    { label: "ANALYTICS_DASHBOARD", href: "/analytics", icon: BarChart3 },
                    { label: "ARCHIVED_DATA", href: "/archived", icon: Archive },
                    { label: "SYSTEM_SETTINGS", href: "/settings", icon: Settings },
                  ].map((item) => (
                    <Command.Item
                      key={item.href}
                      onSelect={() => runCommand(() => router.push(item.href))}
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-all aria-selected:bg-[#8B5CF6] aria-selected:text-black hover:bg-white/5 group"
                    >
                      <item.icon className="h-4 w-4 shrink-0 opacity-40 group-aria-selected:opacity-100" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group 
                  heading="SYSTEM_PREFERENCES" 
                  className="p-2 font-mono text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mt-4 mb-2"
                >
                  <Command.Item
                    onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
                    className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-all aria-selected:bg-white aria-selected:text-black hover:bg-white/5 group"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">TOGGLE_VISUAL_MODE</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Terminal Footer Info */}
              <div className="p-4 border-t-[2px] border-white/10 bg-black/50 flex justify-between items-center font-mono text-[8px] text-white/20 uppercase">
                <span>Total_Directives: {8}</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Target_Link_Stable
                </span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
