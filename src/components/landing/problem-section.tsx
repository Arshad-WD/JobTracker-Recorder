"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Zap, Table, BarChart3 } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs sm:text-sm font-medium text-violet-400 uppercase tracking-widest">
            The Problem
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Job searching shouldn&apos;t be chaos
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Before card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group rounded-2xl border border-red-500/20 bg-red-500/5 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-red-300">Without JobTracker</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Scattered spreadsheets with outdated info",
                "Forgot which companies you applied to",
                "Missed follow-up deadlines",
                "No idea what resume version you used",
                "Recruiter calls and you can't remember details",
                "Lost track of interview rounds",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400/40 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {/* Mockup: messy spreadsheet */}
            <div className="mt-6 rounded-xl overflow-hidden border border-red-500/10">
              <div className="grid grid-cols-4 gap-px bg-red-500/5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 bg-red-500/5 px-2 flex items-center"
                  >
                    <div
                      className="h-2 rounded bg-red-400/20"
                      style={{ width: `${30 + Math.random() * 60}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* After card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative group rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-300">With JobTracker</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Centralized dashboard with real-time stats",
                "Instant search when recruiter calls",
                "Auto-reminders for follow-ups",
                "Resume version linked to each application",
                "Full interview history at your fingertips",
                "Analytics to optimize your strategy",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            {/* Mockup: clean dashboard */}
            <div className="mt-6 rounded-xl overflow-hidden border border-emerald-500/10 p-3 bg-emerald-500/5">
              <div className="grid grid-cols-3 gap-2 mb-3">
                {["12 Applied", "4 Interview", "2 Offer"].map((stat, i) => (
                  <div key={i} className="rounded-lg bg-emerald-500/10 p-2 text-center">
                    <div className="text-xs text-emerald-300/70">{stat.split(" ")[1]}</div>
                    <div className="text-sm font-semibold text-emerald-300">
                      {stat.split(" ")[0]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {[["Google", "Interview"], ["Stripe", "Applied"], ["Meta", "Offer"]].map(([co, st], i) => (
                  <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded bg-emerald-500/5 text-xs">
                    <span className="text-emerald-300/70">{co}</span>
                    <span className="text-emerald-400">{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
