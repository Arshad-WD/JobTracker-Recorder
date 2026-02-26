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
    description: "Fuzzy search across all applications instantly. Get full details when a recruiter calls.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bell,
    title: "Auto Reminders",
    description: "Smart 3-level reminder escalation so you never miss a follow-up window.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Visual dashboards with conversion rates, platform insights, and application scores.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Kanban,
    title: "Kanban Board",
    description: "Drag and drop applications between status columns. Visual workflow management.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: FileText,
    title: "Resume Tracker",
    description: "Track which resume version you sent to each company. Never send the wrong one.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Application scoring, smart tagging, and intelligent duplicate detection.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Phone,
    title: "Incoming Call Mode",
    description: "Full-screen quick-search optimized for when a recruiter calls you unexpectedly.",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    icon: Upload,
    title: "Import & Export",
    description: "Bulk import from CSV, export your data anytime. Your data, your control.",
    gradient: "from-fuchsia-500 to-pink-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      {/* Bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs sm:text-sm font-medium text-violet-400 uppercase tracking-widest">
            Features
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Everything you need to land the job
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/40 max-w-lg mx-auto">
            Built by job hunters, for job hunters. Every feature designed to give you an edge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 md:p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                style={{
                  boxShadow: `0 8px 32px rgba(139, 92, 246, 0.15)`,
                }}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-base font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-violet-500/5 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
