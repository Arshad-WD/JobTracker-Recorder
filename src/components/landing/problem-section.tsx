"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Zap } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="relative py-24 md:py-36 px-4 sm:px-6 lg:px-8">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-red-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 glass-bubble-sm text-[11px] font-semibold text-cyan-400 uppercase tracking-[0.15em] mb-4">
            The Problem
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
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
            className="glass-bubble-lg p-6 md:p-8 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.04), rgba(239, 68, 68, 0.01))",
              borderColor: "rgba(239, 68, 68, 0.1)",
            }}
          >
            {/* Red glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/[0.06] rounded-full blur-[80px]" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-300/90">
                  Without JobTracker
                </h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  "Scattered spreadsheets with outdated info",
                  "Forgot which companies you applied to",
                  "Missed follow-up deadlines",
                  "No idea what resume version you used",
                  "Recruiter calls and you can't remember details",
                  "Lost track of interview rounds",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-white/40"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400/30 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Messy spreadsheet mockup */}
              <div className="mt-6 rounded-xl overflow-hidden border border-red-500/[0.08] bg-red-500/[0.02]">
                <div className="grid grid-cols-4 gap-px">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 px-2 flex items-center"
                      style={{
                        background: `rgba(239, 68, 68, ${
                          0.02 + Math.random() * 0.03
                        })`,
                      }}
                    >
                      <div
                        className="h-1.5 rounded-full bg-red-400/15"
                        style={{ width: `${30 + Math.random() * 60}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* After card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-bubble-lg p-6 md:p-8 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.04), rgba(16, 185, 129, 0.01))",
              borderColor: "rgba(16, 185, 129, 0.1)",
            }}
          >
            {/* Green glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/[0.06] rounded-full blur-[80px]" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-300/90">
                  With JobTracker
                </h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  "Centralized dashboard with real-time stats",
                  "Instant search when recruiter calls",
                  "Auto-reminders for follow-ups",
                  "Resume version linked to each application",
                  "Full interview history at your fingertips",
                  "Analytics to optimize your strategy",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-white/40"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Clean dashboard mockup */}
              <div className="mt-6 rounded-xl overflow-hidden border border-emerald-500/[0.08] p-3 bg-emerald-500/[0.02]">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {["12 Applied", "4 Interview", "2 Offer"].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10 p-2.5 text-center"
                    >
                      <div className="text-[10px] text-emerald-300/50 font-medium">
                        {stat.split(" ")[1]}
                      </div>
                      <div className="text-sm font-semibold text-emerald-300/80">
                        {stat.split(" ")[0]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {(
                    [
                      ["Google", "Interview"],
                      ["Stripe", "Applied"],
                      ["Meta", "Offer"],
                    ] as const
                  ).map(([co, st], i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/[0.03] text-xs"
                    >
                      <span className="text-emerald-300/50">{co}</span>
                      <span className="text-emerald-400/70">{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
