"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Archive,
  Settings,
  ChevronLeft,
  ChevronRight,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from "@/hooks/use-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/archived", label: "Archived", icon: Archive },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, setQuickAddOpen, setQuickSearchOpen } = useAppStore();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 256 : 72,
          x: sidebarOpen ? 0 : -256
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-border bg-card/50 backdrop-blur-xl flex flex-col transition-all",
          !sidebarOpen && "md:translate-x-0"
        )}
      >
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-[-1] bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <motion.div
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className="flex items-center gap-2 overflow-hidden"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
              >
                JobTracker
              </motion.span>
            )}
          </motion.div>

          {/* Mobile close button */}
          {sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 -mr-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {!sidebarOpen && (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="px-3 py-3 space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary",
                  !sidebarOpen && "justify-center px-2"
                )}
                onClick={() => setQuickAddOpen(true)}
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                {sidebarOpen && <span>Quick Add</span>}
              </Button>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right">Quick Add</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2", !sidebarOpen && "justify-center px-2")}
                onClick={() => setQuickSearchOpen(true)}
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">Quick Search</span>}
              </Button>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right">Quick Search (Incoming Call)</TooltipContent>}
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      !sidebarOpen && "justify-center px-2"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon className="h-4 w-4 flex-shrink-0 relative z-10" />
                    {sidebarOpen && <span className="relative z-10">{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {!sidebarOpen && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
