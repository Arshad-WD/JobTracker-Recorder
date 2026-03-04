"use client";

import { motion } from "framer-motion";
import {
  Search,
  Bell,
  BarChart3,
  Kanban,
  FileText,
  Brain,
  Phone,
  Upload,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Fuzzy search across all applications instantly. Get full details when a recruiter calls.",
    color: "cyan",
    glow: "rgba(6, 182, 212, 0.15)",
  },
  {
    icon: Bell,
    title: "Auto Reminders",
    description:
      "Smart 3-level reminder escalation so you never miss a follow-up window.",
    color: "amber",
    glow: "rgba(245, 158, 11, 0.15)",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Visual dashboards with conversion rates, platform insights, and application scores.",
    color: "emerald",
    glow: "rgba(16, 185, 129, 0.15)",
  },
  {
    icon: Kanban,
    title: "Kanban Board",
    description:
      "Drag and drop applications between status columns. Visual workflow management.",
    color: "violet",
    glow: "rgba(139, 92, 246, 0.15)",
  },
  {
    icon: FileText,
    title: "Resume Tracker",
    description:
      "Track which resume version you sent to each company. Never send the wrong one.",
    color: "rose",
    glow: "rgba(244, 63, 94, 0.15)",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description:
      "Application scoring, smart tagging, and intelligent duplicate detection.",
    color: "blue",
    glow: "rgba(59, 130, 246, 0.15)",
  },
  {
    icon: Phone,
    title: "Incoming Call Mode",
    description:
      "Full-screen quick-search optimized for when a recruiter calls you unexpectedly.",
    color: "teal",
    glow: "rgba(20, 184, 166, 0.15)",
  },
  {
    icon: Upload,
    title: "Import & Export",
    description:
      "Bulk import from CSV, export your data anytime. Your data, your control.",
    color: "fuchsia",
    glow: "rgba(217, 70, 239, 0.15)",
  },
];

const colorMap: Record<string, { icon: string; border: string; bg: string }> = {
  cyan: { icon: "text-cyan-400", border: "border-cyan-500/15", bg: "bg-cyan-500/10" },
  amber: { icon: "text-amber-400", border: "border-amber-500/15", bg: "bg-amber-500/10" },
  emerald: { icon: "text-emerald-400", border: "border-emerald-500/15", bg: "bg-emerald-500/10" },
  violet: { icon: "text-violet-400", border: "border-violet-500/15", bg: "bg-violet-500/10" },
  rose: { icon: "text-rose-400", border: "border-rose-500/15", bg: "bg-rose-500/10" },
  blue: { icon: "text-blue-400", border: "border-blue-500/15", bg: "bg-blue-500/10" },
  teal: { icon: "text-teal-400", border: "border-teal-500/15", bg: "bg-teal-500/10" },
  fuchsia: { icon: "text-fuchsia-400", border: "border-fuchsia-500/15", bg: "bg-fuchsia-500/10" },
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-36 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/[0.03] rounded-full blur-[180px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 glass-bubble-sm text-[11px] font-semibold text-violet-400 uppercase tracking-[0.15em] mb-4">
            Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
            Everything you need to land the job
          </h2>
          <p className="mt-5 text-base md:text-lg text-white/30 max-w-lg mx-auto font-light">
            Built by job hunters, for job hunters. Every feature designed to give
            you an edge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, i) => {
            const colors = colorMap[feature.color];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative glass-bubble p-5 md:p-6 hover:bg-white/[0.05] transition-all duration-300 cursor-default"
              >
                {/* Color glow on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${feature.glow}, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className={`relative w-11 h-11 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-5 h-5 ${colors.icon}`} />
                </div>

                <h3 className="relative text-[15px] font-semibold text-white/80 mb-2">
                  {feature.title}
                </h3>
                <p className="relative text-sm text-white/30 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
