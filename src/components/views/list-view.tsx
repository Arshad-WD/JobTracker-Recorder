"use client";

import React from "react";
import { motion } from "framer-motion";

import {
  cn,
  getStatusLabel,
  getPlatformLabel,
  formatDate,
  formatCurrency,
  calculateApplicationScore,
} from "@/lib/utils";
import type { Application, Interview } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

interface ListViewProps {
  applications: AppWithInterviews[];
  onSelect: (_id: string) => void;
}

export function ListView({ applications, onSelect }: ListViewProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No applications to display
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((app, i) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group relative border border-hologram-border bg-hologram-glass/40 backdrop-blur-xl p-6 hover:border-hologram-indigo transition-all cursor-pointer rounded-2xl overflow-hidden"
          onClick={() => onSelect(app.id)}
          style={{ boxShadow: "0 0 30px -10px rgba(79, 70, 229, 0.2)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6">
            {/* Company Avatar / Unit ID */}
            <div className="flex-shrink-0">
               <div className="h-16 w-16 border border-hologram-border bg-hologram-indigo/10 flex items-center justify-center text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                  <span className="text-3xl font-black uppercase text-hologram-cyan">{app.companyName.charAt(0)}</span>
               </div>
               <div className="mt-2 text-center text-[8px] font-mono font-black text-white/40 uppercase tracking-[0.2em]">
                  NODE_ID_{app.id.slice(-4)}
               </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-hologram-cyan transition-colors leading-none hologram-heading">
                    {app.companyName}
                  </h3>
                  <p className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40 mt-1">
                    TARGET_ENTRY // {app.positionTitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-4 py-1.5 border font-bold text-[10px] uppercase tracking-widest bg-white/5 rounded-lg",
                    app.status === "OFFER" ? "border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]" : 
                    app.status === "REJECTED" ? "border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : 
                    "border-hologram-border text-white/60"
                  )}>
                    {getStatusLabel(app.status)}
                  </span>
                  <div className="px-3 py-1.5 border border-hologram-indigo/50 text-hologram-indigo bg-hologram-indigo/5 font-bold text-[10px] uppercase tracking-widest rounded-lg">
                    {app.priority}
                  </div>
                </div>
              </div>

              {/* Technical Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-hologram-border/50">
                <TechnicalStat label="LOCATION_REF" value={app.location} />
                <TechnicalStat label="DEPLOY_DATE" value={formatDate(app.appliedDate)} />
                <TechnicalStat label="UPSTREAM_SRC" value={getPlatformLabel(app.platform)} />
                <TechnicalStat label="MATCH_SCORE" value={`${calculateApplicationScore(app)}%`} />
              </div>

              {/* Tags Area */}
              {app.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-black px-2 py-0.5 border border-white/20 text-white/40 uppercase tracking-widest bg-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Protocol Info */}
              <div className="flex items-center gap-6 pt-2">
                {app.interviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-[#22C55E] animate-pulse" />
                    <span className="text-[10px] font-mono font-black uppercase text-[#22C55E]">
                      ACTIVE_PROTOCOL: {app.interviews.length} PHASES_DETECTED
                    </span>
                  </div>
                )}
                {app.salaryMax && (
                   <span className="text-[10px] font-mono font-black uppercase text-white/40 ml-auto">
                     COMP_RANGE: {formatCurrency(app.salaryMax)}
                   </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TechnicalStat({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[8px] text-hologram-cyan/30 uppercase tracking-[0.3em]">{label}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 truncate">
        {value || "N/A"}
      </p>
    </div>
  );
}
