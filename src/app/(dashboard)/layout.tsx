"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandPalette } from "@/components/command-palette";
import { QuickAddModal } from "@/components/applications/quick-add-modal";
import { QuickSearchMode } from "@/components/search/quick-search-mode";
import { useAppStore } from "@/hooks/use-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <motion.main
        initial={false}
        animate={{ paddingLeft: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="pt-16 min-h-screen"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </motion.main>
      <CommandPalette />
      <QuickAddModal />
      <QuickSearchMode />
    </div>
  );
}
