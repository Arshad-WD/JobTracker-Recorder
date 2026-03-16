"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Archive,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Brain,
  Target,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from "@/hooks/use-store";
import { useMediaQuery } from "@/hooks/use-media-query";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/resume-matcher", label: "Resume Matcher", icon: Search },
  { href: "/interview-prep", label: "Interview Prep", icon: Brain },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/archived", label: "Archived", icon: Archive },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, setQuickAddOpen } = useAppStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // On mobile: sidebar is either fully open (overlay) or completely hidden
  // On desktop: sidebar is either expanded (256px) or collapsed (72px icon strip)

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? 280 : (sidebarOpen ? 256 : 72),
          x: isMobile ? (sidebarOpen ? 0 : -280) : 0,
        }}
        transition={{ duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed left-0 top-0 z-40 h-screen border-r border-hologram-border bg-hologram-glass/80 backdrop-blur-2xl flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-hologram-border">
          {(sidebarOpen || isMobile) ? (
            <div className="flex items-center gap-2 overflow-hidden px-2">
              <span className="font-black text-xl uppercase tracking-tighter text-white">
                JOB<span className="text-hologram-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">TRACKER</span>
              </span>
            </div>
          ) : (
            <div className="h-8 w-8 bg-hologram-cyan/20 border border-hologram-cyan/50 flex items-center justify-center mx-auto rounded-lg">
              <span className="font-black text-xs text-hologram-cyan">JT</span>
            </div>
          )}

          {/* Mobile close button */}
          {isMobile && sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-1 text-white hover:bg-[#8B5CF6]"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick actions */}
        <div className="px-3 py-6 space-y-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "w-full h-12 flex items-center gap-4 px-4 bg-hologram-indigo/20 border border-hologram-indigo/50 text-white font-bold uppercase text-[10px] tracking-widest transition-all rounded-xl",
                  "hover:bg-hologram-indigo/30 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5",
                  !sidebarOpen && !isMobile && "justify-center px-0"
                )}
                onClick={() => {
                  setQuickAddOpen(true);
                  if (isMobile) setSidebarOpen(false);
                }}
              >
                <Plus className="h-4 w-4 flex-shrink-0 text-hologram-cyan" />
                {(sidebarOpen || isMobile) && <span>Quick_Add</span>}
              </button>
            </TooltipTrigger>
            {!sidebarOpen && !isMobile && <TooltipContent side="right">Quick_Add</TooltipContent>}
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative border border-transparent rounded-xl mx-1",
                      isActive
                        ? "text-hologram-cyan border-hologram-cyan/50 bg-hologram-cyan/10 shadow-[inset_0_0_12px_rgba(6,182,212,0.1)]"
                        : "text-white/40 hover:text-white hover:bg-white/5",
                      !sidebarOpen && !isMobile && "justify-center px-0"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-hologram-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" : "text-white/40")} />
                    {(sidebarOpen || isMobile) && <span className="truncate">{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {!sidebarOpen && !isMobile && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>

        {/* Collapse toggle - desktop only */}
        {!isMobile && (
          <div className="p-3 border-t border-hologram-border">
            <button
              className="w-full h-8 flex justify-center items-center text-white/40 hover:text-hologram-cyan transition-colors bg-white/5 rounded-lg border border-transparent hover:border-hologram-cyan/30"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </motion.aside>
    </TooltipProvider>
  );
}
