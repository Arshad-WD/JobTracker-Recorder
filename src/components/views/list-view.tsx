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
          className="group relative border-[3px] border-white bg-black p-6 hover:translate-x-1 hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
          onClick={() => onSelect(app.id)}
          style={{ boxShadow: "8px 8px 0px rgba(139, 92, 246, 0.3)" }}
        >
          <div className="monolith-scanlines rounded-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6">
            {/* Company Avatar / Unit ID */}
            <div className="flex-shrink-0">
               <div className="h-20 w-20 border-[3px] border-white bg-white flex items-center justify-center text-black">
                  <span className="text-4xl font-black uppercase">{app.companyName.charAt(0)}</span>
               </div>
               <div className="mt-2 text-center text-[8px] font-mono font-black text-white/40 uppercase tracking-[0.2em]">
                  NODE_ID_{app.id.slice(-4)}
               </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-[#8B5CF6] transition-colors leading-none">
                    {app.companyName}
                  </h3>
                  <p className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40 mt-1">
                    TARGET_ENTRY // {app.positionTitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-4 py-1.5 border-[2px] font-black text-[10px] uppercase tracking-widest bg-black",
                    app.status === "OFFER" ? "border-[#22C55E] text-[#22C55E]" : 
                    app.status === "REJECTED" ? "border-[#EF4444] text-[#EF4444]" : 
                    "border-white text-white"
                  )}>
                    {getStatusLabel(app.status)}
                  </span>
                  <div className="px-3 py-1.5 border-[2px] border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5 font-black text-[10px] uppercase tracking-widest">
                    P_{app.priority}
                  </div>
                </div>
              </div>

              {/* Technical Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/10">
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
      <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em]">{label}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">
        {value || "N/A"}
      </p>
    </div>
  );
}
