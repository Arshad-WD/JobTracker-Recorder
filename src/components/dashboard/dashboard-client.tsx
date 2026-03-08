"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Target,
  Clock,
  ArrowUpRight,
  Plus,
  Zap,
  Sparkles,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Ghost,
  Cpu,
  Settings,
  BookOpen,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import MonolithCard from "@/components/neon/MonolithCard";
import MonolithButton from "@/components/neon/MonolithButton";
import { getStatusColor, getStatusLabel, cn } from "@/lib/utils";
import { useAppStore } from "@/hooks/use-store";
import { generateInsights, type Insight } from "@/lib/insights";

type Analytics = {
  totalApps: number;
  statusCounts: Array<{ status: string; count: number }>;
  interviewConversionRate: number;
  offerRate: number;
  rejectionRate: number;
  ghostedRate: number;
  offerCount: number;
  interviewCount: number;
  rejectedCount: number;
  ghostedCount: number;
  needsFollowUp: number;
  recentApps: Array<{
    id: string;
    companyName: string;
    positionTitle: string;
    status: string;
    createdAt: Date;
  }>;
  [key: string]: unknown;
} | null;

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function DashboardClient({ analytics }: { analytics: Analytics }) {
  const { setQuickAddOpen } = useAppStore();

  if (!analytics) {
    return <EmptyDashboard onAdd={() => setQuickAddOpen(true)} />;
  }

  const insights = generateInsights(analytics);
  const greeting = getGreeting();

  return (
    <div className="space-y-12">
      {/* Brutalist Hero Header */}
      <HeroHeader 
        greeting={greeting} 
        analytics={analytics} 
        onAdd={() => setQuickAddOpen(true)} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Skill Matrix Visualization [NEW] */}
          <SkillMatrix />

          {/* Insights Section */}
          <InsightsSection insights={insights} />

          {/* Recent Applications Section */}
          <RecentApplications analytics={analytics} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <TacticalFeed />
          <PipelineSection analytics={analytics} />
          <KeyNumbers analytics={analytics} />
          
          {/* System Status Decals */}
          <div className="p-4 border-[2px] border-white/10 font-mono text-[8px] uppercase tracking-[0.2em] text-white/20 space-y-2">
            <div className="flex justify-between">
              <span>Sync_Status:</span>
              <span className="text-[#22C55E]">Optimal</span>
            </div>
            <div className="flex justify-between">
              <span>Encryption:</span>
              <span>AES_256_ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span>99.98%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Redesigned Components ---

const HeroHeader = memo(({ greeting, analytics, onAdd }: { 
  greeting: string; 
  analytics: NonNullable<Analytics>; 
  onAdd: () => void 
}) => (
  <div className="relative border-[3px] border-white bg-black p-8 md:p-12">
    {/* Decorative corner accents */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#8B5CF6] -translate-x-1 -translate-y-1" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#22C55E] translate-x-1 translate-y-1" />

    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
      <div className="space-y-4">
        <div className="inline-block px-3 py-1 bg-[#8B5CF6] text-black font-mono text-[10px] font-black uppercase tracking-widest mb-2">
          SESSION_INITIATED
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
          {greeting}, <span className="text-[#8B5CF6]">OPERATOR</span>
        </h1>
        <p className="font-mono text-xs text-white/40 max-w-xl uppercase leading-relaxed">
          {analytics.totalApps === 0
            ? "NO_ACTIVE_TARGETS_FOUND. INITIALIZE_APPLICATION_SEQUENCE_TO_PROCEED."
            : `COMMANDING_${analytics.totalApps}_ACTIVE_APPLICATIONS. ${analytics.needsFollowUp > 0 ? `ACTION_REQUIRED:_FOLLOW_UP_WITH_${analytics.needsFollowUp}_TARGETS.` : "ALL_SYSTEMS_NOMINAL"}`}
        </p>
      </div>
      <MonolithButton onClick={onAdd} glitch className="min-w-[240px]">
        Deploy_New_Target
      </MonolithButton>
    </div>

    {/* Quick Stats Grid */}
    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 border-t-[3px] border-white">
      <SimpleStat label="Active_Apps" value={analytics.totalApps} tag="01" />
      <SimpleStat label="Conv_Rate" value={`${analytics.interviewConversionRate}%`} color="text-[#8B5CF6]" tag="02" />
      <SimpleStat label="Off_Secured" value={analytics.offerCount} color="text-[#22C55E]" tag="03" />
      <SimpleStat label="Act_Required" value={analytics.needsFollowUp} color={analytics.needsFollowUp > 0 ? "text-[#F59E0B]" : "text-white/20"} tag="04" />
    </div>
  </div>
));
HeroHeader.displayName = "HeroHeader";

const InsightsSection = memo(({ insights }: { insights: Insight[] }) => {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#8B5CF6]">System_Insights</h2>
        <div className="flex-1 h-[2px] bg-white/10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <MonolithCard key={insight.id} tag={insight.type.toUpperCase()}>
            <div className="flex items-start gap-4">
               <span className="text-3xl filter grayscale contrast-200">{insight.emoji}</span>
               <div className="space-y-1">
                 <h3 className="text-xs font-black uppercase tracking-widest">{insight.title}</h3>
                 <p className="font-mono text-[10px] text-white/60 leading-relaxed uppercase">{insight.description}</p>
               </div>
            </div>
          </MonolithCard>
        ))}
      </div>
    </div>
  );
});
InsightsSection.displayName = "InsightsSection";

const RecentApplications = memo(({ analytics }: { analytics: NonNullable<Analytics> }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#22C55E]">Recent_Activity</h2>
        <div className="h-[2px] w-24 bg-white/10" />
      </div>
      <Link href="/applications" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest flex items-center gap-2">
        Full_Log <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>

    <div className="border-[3px] border-white divide-y-[3px] divide-white bg-black">
      {analytics.recentApps.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center opacity-20">
          <Ghost className="h-12 w-12 mb-4" />
          <p className="font-mono text-[10px] uppercase tracking-widest">No_Trace_Detected</p>
        </div>
      ) : (
        analytics.recentApps.map((app) => (
          <Link
            key={app.id}
            href={`/applications?id=${app.id}`}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-[#8B5CF6]/5 group transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="h-10 w-10 border-[2px] border-white/20 items-center justify-center hidden md:flex font-black text-white/20 group-hover:border-[#8B5CF6] group-hover:text-[#8B5CF6] transition-colors">
                {app.companyName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter group-hover:text-[#8B5CF6] transition-colors">
                  {app.companyName}
                </h3>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  {app.positionTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0">
               <div className={cn(
                 "px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest border-[2px]",
                 getStatusStyle(app.status)
               )}>
                 {getStatusLabel(app.status)}
               </div>
               <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))
      )}
    </div>
  </div>
));
RecentApplications.displayName = "RecentApplications";

const PipelineSection = memo(({ analytics }: { analytics: NonNullable<Analytics> }) => (
  <MonolithCard title="Pipeline" tag="PROC-01">
    <div className="space-y-6">
      {analytics.statusCounts.length === 0 ? (
        <p className="font-mono text-[10px] text-white/20 uppercase">Waiting_For_Data_Input...</p>
      ) : (
        analytics.statusCounts.map((s) => {
          const pct = analytics.totalApps > 0 ? Math.round((s.count / analytics.totalApps) * 100) : 0;
          return (
            <div key={s.status} className="space-y-2 group">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest group-hover:text-[#8B5CF6] transition-colors">
                  {getStatusLabel(s.status)}
                </span>
                <span className="font-mono text-[10px] text-white/40">{s.count}</span>
              </div>
              <div className="h-3 border border-white/10 bg-black p-[2px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className={cn("h-full", getStatusBarColor(s.status))}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  </MonolithCard>
));
PipelineSection.displayName = "PipelineSection";

const SkillMatrix = memo(() => {
  const skills = [
    { label: "FRONTEND", level: 85, color: "#8B5CF6" },
    { label: "BACKEND", level: 70, color: "#22C55E" },
    { label: "SYSTEM_ARCH", level: 60, color: "#F59E0B" },
    { label: "DEVOPS", level: 45, color: "#EC4899" },
    { label: "AI_PROMPT", level: 90, color: "#A78BFA" },
    { label: "COMMUNICATION", level: 75, color: "#10B981" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#F59E0B]">Skill_Matrix_v4.2</h2>
        <div className="flex-1 h-[2px] bg-white/10" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.label} className="border-[2px] border-white/10 bg-black p-4 group hover:border-white transition-all">
            <div className="flex justify-between items-end mb-3">
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">{skill.label}</span>
              <span className="font-mono text-[10px] text-white/20">{skill.level}%</span>
            </div>
            <div className="h-2 bg-white/5 relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                className="h-full bg-white group-hover:bg-[#8B5CF6] transition-colors"
                style={{ boxShadow: `0 0 10px ${skill.color}40` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
SkillMatrix.displayName = "SkillMatrix";

const TacticalFeed = memo(() => {
  const events = [
    { time: "12:44:02", msg: "GOAL_CREATED: PERSISTENCE_DRIVE", type: "system" },
    { time: "11:20:15", msg: "RESUME_ANALYSIS_COMPLETE", type: "ai" },
    { time: "09:15:33", msg: "TARGET_UPDATED: GOOGLE // L4_ENG", type: "user" },
    { time: "08:00:00", msg: "DAILY_ROUTINE_INITIALIZED", type: "system" },
  ];

  return (
    <MonolithCard title="Tactical_Feed" tag="LOG-X">
      <div className="space-y-4 font-mono">
        {events.map((ev, i) => (
          <div key={i} className="flex gap-4 text-[9px] leading-tight group">
            <span className="text-white/20 shrink-0">{ev.time}</span>
            <span className={cn(
               "uppercase transition-colors",
               ev.type === 'ai' ? "text-[#8B5CF6]" : "text-white/60 group-hover:text-white"
            )}>
               {`> ${ev.msg}`}
            </span>
          </div>
        ))}
        <div className="pt-4 mt-4 border-t border-white/10">
           <div className="flex items-center gap-2 text-[8px] text-[#22C55E] animate-pulse">
              <div className="h-1 w-1 bg-[#22C55E]" />
              <span>LISTENING_FOR_EVENTS...</span>
           </div>
        </div>
      </div>
    </MonolithCard>
  );
});
TacticalFeed.displayName = "TacticalFeed";

const KeyNumbers = memo(({ analytics }: { analytics: NonNullable<Analytics> }) => (
  <MonolithCard title="Success_Metrics" tag="ANL-09">
    <div className="space-y-4">
      <MetricRow label="Offer_Conv" value={`${analytics.offerRate}%`} color="text-[#22C55E]" />
      <MetricRow label="Interview_Rate" value={`${analytics.interviewConversionRate}%`} color="text-[#8B5CF6]" />
      <MetricRow label="Rejection_Rate" value={`${analytics.rejectionRate}%`} color="text-[#EF4444]" />
      <MetricRow label="Ghosted_Rate" value={`${analytics.ghostedRate}%`} color="text-white/20" />
    </div>
  </MonolithCard>
));
KeyNumbers.displayName = "KeyNumbers";

// --- Utility Components ---

function SimpleStat({ label, value, color, tag }: {
  label: string;
  value: string | number;
  color?: string;
  tag: string;
}) {
  return (
    <div className="p-6 border-r-[3px] border-white last:border-r-0 hover:bg-white/5 transition-colors group">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.2em]">{label}</span>
        <span className="font-mono text-[8px] text-[#8B5CF6]/40 uppercase tracking-[0.2em]">{tag}</span>
      </div>
      <div className={cn("text-3xl font-black tracking-tighter", color || "text-white")}>
        {value}
      </div>
    </div>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{label}</span>
      <span className={cn("font-black tracking-tighter", color || "text-white")}>{value}</span>
    </div>
  );
}

function getStatusStyle(status: string): string {
    const map: Record<string, string> = {
        OFFER: "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10",
        REJECTED: "border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10",
        INTERVIEW: "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/10",
        SCREENING: "border-[#22D3EE] text-[#22D3EE] bg-[#22D3EE]/10",
        APPLIED: "border-white/20 text-white/60",
        GHOSTED: "border-white/10 text-white/20",
    };
    return map[status] || "border-white/20 text-white/60";
}

function getStatusBarColor(status: string): string {
  const map: Record<string, string> = {
    APPLIED: "bg-blue-500", 
    SCREENING: "bg-cyan-500", 
    INTERVIEW: "bg-[#8B5CF6]",
    OFFER: "bg-[#22C55E]", 
    REJECTED: "bg-[#EF4444]", 
    GHOSTED: "bg-white/10", 
    NO_CONFIRMATION: "bg-amber-500",
  };
  return map[status] || "bg-white/10";
}

function EmptyDashboard({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="relative mb-12">
        <div className="h-24 w-24 border-[4px] border-white flex items-center justify-center shadow-[8px_8px_0px_#8B5CF6]">
           <Plus className="h-12 w-12 text-white" />
        </div>
      </div>
      <h3 className="text-4xl font-black uppercase tracking-tighter">No_Data_Detected</h3>
      <p className="font-mono text-xs text-white/40 mt-4 max-w-sm uppercase tracking-widest">
        The board is clear. Initialize your job hunt by deploying your first tracking node.
      </p>
      <MonolithButton onClick={onAdd} glitch className="mt-12 min-w-[300px]">
        Deploy_First_Target
      </MonolithButton>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
