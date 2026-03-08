"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  LogOut,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppStore } from "@/hooks/use-store";
import { useMediaQuery } from "@/hooks/use-media-query";

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const {
    setCommandOpen,
    searchQuery,
    setSearchQuery,
    unreadCount,
    sidebarOpen,
    setSidebarOpen,
  } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => setMounted(true), []);

  return (
    <motion.header
      initial={false}
      animate={{ paddingLeft: isMobile ? 0 : (sidebarOpen ? 256 : 72) }}
      transition={{ duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 right-0 left-0 z-30 h-16 border-b-[3px] border-white bg-black/95"
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0 text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop search */}
          <div className="hidden md:flex items-center gap-2 max-w-md flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B5CF6]" />
              <input
                placeholder="Search Archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 h-10 bg-black border-[2px] border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#8B5CF6] transition-all"
              />
            </div>
            <button
              className="px-3 h-10 border-[2px] border-white/20 text-white/40 hover:text-white hover:border-white transition-all font-mono text-[10px] flex items-center gap-2"
              onClick={() => setCommandOpen(true)}
            >
              <Command className="h-3 w-3" />
              <span>TERMINAL [K]</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 border-[2px] border-white/20 flex items-center justify-center hover:border-[#8B5CF6] transition-all"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          {/* Notifications */}
          <button className="h-10 w-10 border-[2px] border-white/20 flex items-center justify-center hover:border-[#22C55E] relative transition-all">
            <Bell className="h-4 w-4 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#22C55E] pulseShadow" />
            )}
          </button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 px-4 border-[2px] border-white text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
                {session?.user?.name?.split(' ')[0] || "SUBJECT"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black border-[3px] border-white rounded-none p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-mono text-[10px] uppercase text-white/40">
                Identity_Locked
              </DropdownMenuLabel>
              <div className="px-2 py-4 border-b border-white/10 mb-2">
                  <p className="text-xs font-black text-white uppercase">{session?.user?.name || "User"}</p>
                  <p className="text-[10px] font-mono text-[#8B5CF6] truncate">{session?.user?.email}</p>
              </div>
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="flex items-center gap-4 px-2 py-3 focus:bg-[#EF4444] group cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-[#EF4444] group-focus:text-white" />
                <span className="text-[10px] font-black uppercase text-white group-focus:text-white">Terminate_Session</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B5CF6]" />
          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-10 bg-black border-[2px] border-white/20 text-white font-mono text-xs"
          />
        </div>
      </div>
    </motion.header>
  );
}
