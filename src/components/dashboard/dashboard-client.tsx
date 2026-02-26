"use client";

import React from "react";
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
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
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
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function DashboardClient({ analytics }: { analytics: Analytics }) {
  const { setQuickAddOpen } = useAppStore();

  if (!analytics) {
    return <EmptyDashboard onAdd={() => setQuickAddOpen(true)} />;
  }

  const insights = generateInsights(analytics);
  const greeting = getGreeting();

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent border border-white/[0.06] p-6 md:p-8"
      >
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }} />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {greeting} <span className="inline-block">👋</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {analytics.totalApps === 0
                ? "Your job search journey starts here."
                : `Tracking ${analytics.totalApps} application${analytics.totalApps === 1 ? "" : "s"} • ${analytics.needsFollowUp} need${analytics.needsFollowUp === 1 ? "s" : ""} attention`}
            </p>
          </div>
          <Button
            onClick={() => setQuickAddOpen(true)}
            size="lg"
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="relative mt-6 flex flex-wrap gap-6 text-sm">
          <QuickStat icon={Briefcase} label="Total" value={analytics.totalApps} />
          <QuickStat icon={TrendingUp} label="Interview Rate" value={`${analytics.interviewConversionRate}%`} color="text-violet-400" />
          <QuickStat icon={Target} label="Offers" value={analytics.offerCount} color="text-emerald-400" />
          <QuickStat icon={Clock} label="Follow-ups" value={analytics.needsFollowUp} color={analytics.needsFollowUp > 0 ? "text-amber-400" : undefined} />
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Insights */}
          {insights.length > 0 && (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2.5">
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 px-1">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                Smart Insights
              </h2>
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </motion.div>
          )}

          {/* Recent Applications */}
          <Card className="border-0 bg-card/60 backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                Recent Applications
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs h-7">
                <a href="/applications" className="gap-1">
                  View all <ArrowUpRight className="h-3 w-3" />
                </a>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {analytics.recentApps.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No applications yet. Click &quot;Add Application&quot; to get started.
                </p>
              ) : (
                <div className="space-y-1">
                  {analytics.recentApps.map((app) => (
                    <a
                      key={app.id}
                      href={`/applications?id=${app.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500/15 to-indigo-500/15 border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <span className="text-xs font-bold text-muted-foreground">
                            {app.companyName.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {app.companyName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {app.positionTitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <Badge className={`${getStatusColor(app.status)} text-[10px]`} variant="outline">
                          {getStatusLabel(app.status)}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Pipeline */}
          <Card className="border-0 bg-card/60 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2.5">
              {analytics.statusCounts.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">
                  Your pipeline will appear here.
                </p>
              ) : (
                analytics.statusCounts.map((s) => {
                  const pct = analytics.totalApps > 0 ? Math.round((s.count / analytics.totalApps) * 100) : 0;
                  return (
                    <div key={s.status} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusDot status={s.status} />
                          <span className="text-xs font-medium">{getStatusLabel(s.status)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">{s.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getStatusBarColor(s.status)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Key Numbers */}
          <Card className="border-0 bg-card/60 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                Key Numbers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <NumberRow icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />} label="Offer Rate" value={`${analytics.offerRate}%`} />
              <NumberRow icon={<TrendingUp className="h-3.5 w-3.5 text-violet-400" />} label="Interview Rate" value={`${analytics.interviewConversionRate}%`} />
              <NumberRow icon={<AlertCircle className="h-3.5 w-3.5 text-red-400" />} label="Rejection Rate" value={`${analytics.rejectionRate}%`} />
              <NumberRow icon={<Ghost className="h-3.5 w-3.5 text-gray-400" />} label="Ghosted" value={`${analytics.ghostedRate}%`} />
              <NumberRow icon={<Briefcase className="h-3.5 w-3.5 text-blue-400" />} label="Interviews" value={analytics.interviewCount} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function QuickStat({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${color || "text-muted-foreground"}`} />
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-bold ${color || ""}`}>{value}</span>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const styleMap = {
    action: "border-l-blue-500 bg-blue-500/[0.03]",
    success: "border-l-emerald-500 bg-emerald-500/[0.03]",
    warning: "border-l-amber-500 bg-amber-500/[0.03]",
    tip: "border-l-violet-500 bg-violet-500/[0.03]",
  };

  return (
    <motion.div variants={fadeUp}>
      <div className={`p-3.5 rounded-xl border border-white/[0.06] border-l-[3px] ${styleMap[insight.type]} hover:bg-muted/30 transition-colors`}>
        <div className="flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">{insight.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-semibold leading-snug">{insight.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    APPLIED: "bg-blue-400", SCREENING: "bg-cyan-400", INTERVIEW: "bg-violet-400",
    OFFER: "bg-emerald-400", REJECTED: "bg-red-400", GHOSTED: "bg-gray-400", NO_CONFIRMATION: "bg-amber-400",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status] || "bg-gray-400"}`} />;
}

function getStatusBarColor(status: string): string {
  const map: Record<string, string> = {
    APPLIED: "bg-blue-500/60", SCREENING: "bg-cyan-500/60", INTERVIEW: "bg-violet-500/60",
    OFFER: "bg-emerald-500/60", REJECTED: "bg-red-500/40", GHOSTED: "bg-gray-500/40", NO_CONFIRMATION: "bg-amber-500/50",
  };
  return map[status] || "bg-gray-500/40";
}

function NumberRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold font-mono">{value}</span>
    </div>
  );
}

function EmptyDashboard({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
        <Briefcase className="h-7 w-7 text-violet-400" />
      </div>
      <h3 className="text-base font-semibold">Welcome to JobTracker</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
        Add your first job application and let us help you stay organized.
      </p>
      <Button onClick={onAdd} className="mt-4 gap-2" size="sm">
        <Plus className="h-4 w-4" />
        Add Your First Application
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
