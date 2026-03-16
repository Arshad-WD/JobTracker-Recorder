"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  ExternalLink,
  MoreHorizontal,
  Archive,
  Trash2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  cn,
  getStatusLabel,
  getPlatformLabel,
  getJobTypeLabel,
  formatDate,
  calculateApplicationScore,
} from "@/lib/utils";
import { deleteApplication, archiveApplication } from "@/server/actions";
import { useAppStore } from "@/hooks/use-store";
import { toast } from "sonner";
import type { Application, Interview } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

interface TableViewProps {
  applications: AppWithInterviews[];
  onSelect: (_id: string) => void;
}

export function TableView({ applications, onSelect }: TableViewProps) {
  const { removeApplication, updateApplication } = useAppStore();

  if (applications.length === 0) {
    return <EmptyView />;
  }

  const handleDelete = async (id: string) => {
    removeApplication(id);
    try {
      await deleteApplication(id);
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleArchive = async (id: string) => {
    updateApplication(id, { archived: true });
    try {
      await archiveApplication(id, true);
      toast.success("Application archived");
    } catch {
      toast.error("Failed to archive");
    }
  };

  return (
    <div className="border border-hologram-border bg-hologram-glass/40 backdrop-blur-xl rounded-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-hologram-cyan/5 via-transparent to-hologram-indigo/5 pointer-events-none" />
      <div className="overflow-x-auto relative z-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hologram-border bg-white/5">
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan px-6 py-4">UNIT_ID</th>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan px-6 py-4 hidden md:table-cell">POSITION_VECTOR</th>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan px-6 py-4">NODE_STATUS</th>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan px-6 py-4 hidden lg:table-cell">UPSTREAM_SRC</th>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan px-6 py-4 hidden sm:table-cell">DEPLOY_TYPE</th>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan px-6 py-4 hidden md:table-cell">MATCH_IDX</th>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan px-6 py-4 hidden sm:table-cell">TIMESTAMP</th>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="font-mono text-[11px]">
            {applications.map((app, i) => (
              <motion.tr
                key={app.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-hologram-border/50 hover:bg-hologram-cyan/5 cursor-pointer group transition-colors"
                onClick={() => onSelect(app.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 border border-hologram-border bg-hologram-glass flex items-center justify-center flex-shrink-0 group-hover:border-hologram-cyan transition-all rounded-lg shadow-sm">
                      <span className="text-sm font-black uppercase text-hologram-cyan">{app.companyName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-tight text-white group-hover:text-hologram-cyan transition-colors hologram-heading">{app.companyName}</p>
                      {app.location && (
                        <p className="text-[8px] text-white/40 flex items-center gap-1 uppercase tracking-tighter mt-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          {app.location}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/60 uppercase font-black tracking-tight hidden md:table-cell">{app.positionTitle}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 border font-bold text-[9px] uppercase tracking-widest rounded-lg",
                    app.status === "OFFER" ? "border-green-500/50 text-green-400 bg-green-500/5" : 
                    app.status === "REJECTED" ? "border-red-500/50 text-red-400 bg-red-500/5" : 
                    "border-hologram-border/50 text-white/40"
                  )}>
                    {getStatusLabel(app.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/40 hidden lg:table-cell uppercase">
                  {getPlatformLabel(app.platform)}
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="text-white/40 uppercase">
                    {getJobTypeLabel(app.jobType)}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateApplicationScore(app)}%` }}
                        className="h-full bg-gradient-to-r from-hologram-indigo to-hologram-cyan"
                      />
                    </div>
                    <span className="text-hologram-cyan font-bold">{calculateApplicationScore(app)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/40 hidden sm:table-cell uppercase tracking-tighter">
                  {formatDate(app.appliedDate)}
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-none border border-transparent hover:border-white/20 transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black border-[2px] border-white rounded-none p-1 min-w-[160px]">
                      {app.jobLink && (
                        <DropdownMenuItem asChild className="rounded-none hover:bg-white hover:text-black font-black uppercase text-[10px] cursor-pointer">
                          <a href={app.jobLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            EXTERNAL_LINK
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleArchive(app.id)} className="rounded-none hover:bg-white hover:text-black font-black uppercase text-[10px] cursor-pointer">
                        <Archive className="mr-2 h-3.5 w-3.5" />
                        ARCHIVE_INIT
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10 my-1" />
                      <DropdownMenuItem
                        className="rounded-none hover:bg-[#EF4444] hover:text-white font-black uppercase text-[10px] cursor-pointer text-[#EF4444]"
                        onClick={() => handleDelete(app.id)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        PURGE_UNIT
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyView() {
  const { setQuickAddOpen } = useAppStore();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4"
      >
        <Briefcase className="h-8 w-8 text-blue-400" />
      </motion.div>
      <h3 className="text-lg font-semibold">No applications found</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Try adjusting your filters or add a new application
      </p>
      <Button onClick={() => setQuickAddOpen(true)} className="mt-4 gap-2" variant="outline">
        <Building2 className="h-4 w-4" />
        Add Application
      </Button>
    </motion.div>
  );
}
