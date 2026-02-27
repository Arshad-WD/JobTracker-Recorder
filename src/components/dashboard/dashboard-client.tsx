"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
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
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
};

export function DashboardClient({ analytics }: { analytics: Analytics }) {
  const { setQuickAddOpen } = useAppStore();

  if (!analytics) {
    return <EmptyDashboard onAdd={() => setQuickAddOpen(true)} />;
  }

  const insights = generateInsights(analytics);
  const greeting = getGreeting();

  return (
    <div className="space-y-8 page-fade-in">
      {/* Premium Hero Header */}
      <HeroHeader 
        greeting={greeting} 
        analytics={analytics} 
        onAdd={() => setQuickAddOpen(true)} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Insights Section */}
          <InsightsSection insights={insights} />

          {/* Recent Applications Section */}
          <RecentApplications analytics={analytics} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <PipelineSection analytics={analytics} />
          <KeyNumbers analytics={analytics} />
        </div>
      </div>
    </div>
  );
}

// --- Memoized Components for Performance ---

const HeroHeader = memo(({ greeting, analytics, onAdd }: { 
  greeting: string; 
  analytics: NonNullable<Analytics>; 
  onAdd: () => void 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] dark:bg-card/40 backdrop-blur-md p-6 md:p-10 premium-gradient shadow-2xl"
  >
    {/* Animated background element */}
    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full animate-blob" />
    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-500/10 blur-[80px] rounded-full animate-blob animation-delay-2000" />

    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {greeting}, <span className="text-primary">{analytics.totalApps === 0 ? "Step into your future" : "back at it"}</span> <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg">
          {analytics.totalApps === 0
            ? "Your journey to the perfect role begins here. Let's make every application count."
            : `You're steering ${analytics.totalApps} application${analytics.totalApps === 1 ? "" : "s"}. ${analytics.needsFollowUp > 0 ? `Don't forget the ${analytics.needsFollowUp} follow-up${analytics.needsFollowUp === 1 ? "" : "s"} waiting for you.` : "Keep that momentum going!"}`}
        </p>
      </div>
      <Button
        onClick={onAdd}
        size="lg"
        className="w-full md:w-auto h-14 px-8 rounded-2xl gap-3 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 text-base font-semibold"
      >
        <Plus className="h-5 w-5" />
        New Application
      </Button>
    </div>

    {/* Refined Quick Stats */}
    <div className="relative mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
      <SimpleStat icon={Briefcase} label="Applications" value={analytics.totalApps} />
      <SimpleStat icon={TrendingUp} label="Intv. Rate" value={`${analytics.interviewConversionRate}%`} color="text-primary" />
      <SimpleStat icon={Target} label="Offers" value={analytics.offerCount} color="text-emerald-500" />
      <SimpleStat icon={Clock} label="Pending" value={analytics.needsFollowUp} color={analytics.needsFollowUp > 0 ? "text-amber-500" : undefined} />
    </div>
  </motion.div>
));
HeroHeader.displayName = "HeroHeader";

const InsightsSection = memo(({ insights }: { insights: Insight[] }) => {
  if (insights.length === 0) return null;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-primary" />
        Intelligent Coaching
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </motion.div>
  );
});
InsightsSection.displayName = "InsightsSection";

const RecentApplications = memo(({ analytics }: { analytics: NonNullable<Analytics> }) => (
  <Card className="glass-card border-0">
    <CardHeader className="flex flex-row items-center justify-between pb-4">
      <div className="space-y-1">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-400" />
          Recent Activity
        </CardTitle>
        <p className="text-xs text-muted-foreground font-medium">Your latest moves in the job market</p>
      </div>
      <Button variant="ghost" size="sm" asChild className="h-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
        <a href="/applications" className="gap-2 text-xs font-semibold">
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </Button>
    </CardHeader>
    <CardContent className="pt-2">
      {analytics.recentApps.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
          <Ghost className="h-10 w-10 mb-3 text-muted-foreground" />
          <p className="text-sm">Silence is just pre-noise. Start applying!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {analytics.recentApps.map((app, i) => (
            <motion.a
              key={app.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              href={`/applications?id=${app.id}`}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary/[0.03] border border-transparent hover:border-primary/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/10 border border-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-sm font-black text-primary/80 uppercase">
                    {app.companyName.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[15px] truncate group-hover:text-primary transition-colors">
                    {app.companyName}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {app.positionTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <Badge className={`${getStatusColor(app.status)} px-3 py-1 rounded-full text-[10px] font-bold border-0`} variant="outline">
                  {getStatusLabel(app.status)}
                </Badge>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
));
RecentApplications.displayName = "RecentApplications";

const PipelineSection = memo(({ analytics }: { analytics: NonNullable<Analytics> }) => (
  <Card className="glass-card border-0">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-bold flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
        Your Pipeline
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-5">
      {analytics.statusCounts.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2 font-medium">
          Once you start applying, we&apos;ll map your progress here.
        </p>
      ) : (
        analytics.statusCounts.map((s) => {
          const pct = analytics.totalApps > 0 ? Math.round((s.count / analytics.totalApps) * 100) : 0;
          return (
            <div key={s.status} className="space-y-1.5 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <StatusDot status={s.status} />
                  <span className="text-xs font-bold text-foreground/80 group-hover:text-primary transition-colors">{getStatusLabel(s.status)}</span>
                </div>
                <span className="text-[10px] font-black font-mono text-muted-foreground bg-muted w-8 h-5 flex items-center justify-center rounded-md">{s.count}</span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden ring-1 ring-inset ring-white/[0.02]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "circOut" }}
                  className={`h-full rounded-full ${getStatusBarColor(s.status)} shadow-[0_0_12px_rgba(0,0,0,0.1)]`}
                />
              </div>
            </div>
          );
        })
      )}
    </CardContent>
  </Card>
));
PipelineSection.displayName = "PipelineSection";

const KeyNumbers = memo(({ analytics }: { analytics: NonNullable<Analytics> }) => (
  <Card className="glass-card border-0 overflow-hidden">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-bold flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-emerald-500" />
        Success Metrics
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pt-0">
      <MetricRow 
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} 
        label="Offer Conversion" 
        value={`${analytics.offerRate}%`} 
      />
      <MetricRow 
        icon={<TrendingUp className="h-4 w-4 text-primary" />} 
        label="Interview Rate" 
        value={`${analytics.interviewConversionRate}%`} 
      />
      <MetricRow 
        icon={<AlertCircle className="h-4 w-4 text-rose-500" />} 
        label="Rejection Rate" 
        value={`${analytics.rejectionRate}%`} 
      />
      <MetricRow 
        icon={<Ghost className="h-4 w-4 text-slate-400" />} 
        label="Ghosted Rate" 
        value={`${analytics.ghostedRate}%`} 
      />
    </CardContent>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-rose-500 opacity-30" />
  </Card>
));
KeyNumbers.displayName = "KeyNumbers";

// --- Utility Components ---

function SimpleStat({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm group hover:bg-white/[0.05] transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-3.5 w-3.5 ${color || "text-muted-foreground"}`} />
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className={`text-xl font-black ${color || "text-foreground"}`}>{value}</div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const styles = {
    action: "border-primary/20 bg-primary/5 text-primary",
    success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
    warning: "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
    tip: "border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400",
  }[insight.type];

  return (
    <motion.div variants={fadeUp}>
      <div className={`p-5 rounded-2xl border ${styles} relative overflow-hidden group hover:scale-[1.01] transition-transform`}>
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex items-start gap-4">
          <span className="text-2xl leading-none">{insight.emoji}</span>
          <div className="space-y-1">
            <h3 className="text-sm font-black leading-none">{insight.title}</h3>
            <p className="text-xs leading-relaxed opacity-80 font-medium">{insight.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    APPLIED: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]", 
    SCREENING: "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]", 
    INTERVIEW: "bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]",
    OFFER: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]", 
    REJECTED: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]", 
    GHOSTED: "bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]", 
    NO_CONFIRMATION: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status] || "bg-gray-400"}`} />;
}

function getStatusBarColor(status: string): string {
  const map: Record<string, string> = {
    APPLIED: "bg-blue-500", 
    SCREENING: "bg-cyan-500", 
    INTERVIEW: "bg-primary",
    OFFER: "bg-emerald-500", 
    REJECTED: "bg-rose-500", 
    GHOSTED: "bg-slate-500", 
    NO_CONFIRMATION: "bg-amber-500",
  };
  return map[status] || "bg-gray-500";
}

function MetricRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2 group cursor-default">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-muted/40 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <span className="text-xs font-bold text-foreground/70 group-hover:text-foreground transition-colors">{label}</span>
      </div>
      <span className="text-sm font-black font-mono tracking-tighter">{value}</span>
    </div>
  );
}

function EmptyDashboard({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center page-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative h-20 w-20 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-2xl">
          <Plus className="h-10 w-10 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-black tracking-tight">Your search starts here.</h3>
      <p className="text-muted-foreground mt-2 max-w-sm font-medium">
        Every great career move began with a single application. Add your first one today.
      </p>
      <Button onClick={onAdd} className="mt-8 h-12 px-8 rounded-xl gap-2 text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
        <Plus className="h-5 w-5" />
        Track First Job
      </Button>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
