"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Deep background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#050508]" />

        {/* Multi-chromatic luminous orbs */}
        <div className="absolute top-[15%] left-[10%] w-[600px] h-[600px] bg-cyan-500/[0.07] rounded-full blur-[150px] animate-orb-drift" />
        <div className="absolute top-[30%] right-[5%] w-[500px] h-[500px] bg-violet-600/[0.08] rounded-full blur-[140px] animate-orb-drift animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[30%] w-[550px] h-[550px] bg-fuchsia-500/[0.06] rounded-full blur-[160px] animate-orb-drift animation-delay-4000" />
        <div className="absolute top-[60%] right-[30%] w-[400px] h-[400px] bg-blue-500/[0.05] rounded-full blur-[130px] animate-orb-drift animation-delay-6000" />

        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050508_75%)]" />
      </div>

      {/* Floating glass bubbles — decorative */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {/* Bubble 1 — Applied card */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 1.5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[12%] left-[6%] md:left-[14%] w-48 md:w-56 p-4 glass-bubble hidden sm:block"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
            <span className="text-[11px] text-emerald-400 font-semibold tracking-wide">
              APPLIED
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-white/[0.06]" />
            <div className="h-2 w-1/2 rounded-full bg-white/[0.04]" />
          </div>
        </motion.div>

        {/* Bubble 2 — Interview card */}
        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -1, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
          className="absolute top-[18%] right-[4%] md:right-[10%] w-52 md:w-64 p-4 glass-bubble"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-lg shadow-violet-400/40" />
            <span className="text-[11px] text-violet-400 font-semibold tracking-wide">
              INTERVIEW
            </span>
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center border border-white/5">
              <span className="text-[9px] font-bold text-white/40">G</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-20 rounded-full bg-white/[0.06]" />
              <div className="h-1.5 w-14 rounded-full bg-white/[0.04]" />
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="px-2.5 py-1 rounded-full bg-violet-500/[0.08] border border-violet-500/15">
              <span className="text-[9px] text-violet-300 font-medium">
                Round 2
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-amber-500/[0.08] border border-amber-500/15">
              <span className="text-[9px] text-amber-300 font-medium">
                Tomorrow
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bubble 3 — Offer */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 0.5, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
          className="absolute bottom-[22%] left-[4%] md:left-[8%] w-44 md:w-52 p-4 glass-bubble hidden md:block"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/40" />
            <span className="text-[11px] text-amber-400 font-semibold tracking-wide">
              OFFER 🎉
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-2/3 rounded-full bg-white/[0.06]" />
            <div className="h-2 w-1/2 rounded-full bg-white/[0.04]" />
          </div>
        </motion.div>

        {/* Bubble 4 — Stats mini chart */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
          className="absolute bottom-[18%] right-[6%] md:right-[12%] w-48 md:w-56 p-4 glass-bubble hidden sm:block"
        >
          <div className="text-[10px] text-white/30 mb-2.5 font-medium tracking-wide">
            THIS MONTH
          </div>
          <div className="flex items-end gap-1">
            {[35, 55, 40, 75, 50, 65, 85, 60, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500/30 via-violet-500/20 to-fuchsia-500/10"
                style={{ height: `${h * 0.3}px` }}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white/60">24</span>
            <span className="text-[10px] text-emerald-400 font-medium">
              +12%
            </span>
          </div>
        </motion.div>

        {/* Small decorative bubbles */}
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[45%] left-[25%] w-16 h-16 rounded-full bg-cyan-400/[0.03] border border-cyan-400/[0.06] backdrop-blur-sm hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -6, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute top-[35%] right-[25%] w-10 h-10 rounded-full bg-fuchsia-400/[0.04] border border-fuchsia-400/[0.06] backdrop-blur-sm hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute bottom-[35%] left-[50%] w-8 h-8 rounded-full bg-violet-400/[0.05] border border-violet-400/[0.08] backdrop-blur-sm hidden lg:block"
        />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-[#050508] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 mb-8 glass-bubble-sm cursor-default"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-white/50 font-medium tracking-wide">
            Intelligent Job Application Tracking
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-[-0.03em]"
        >
          <span className="bg-gradient-to-b from-white via-white/90 to-white/30 bg-clip-text text-transparent">
            Track Every Application.
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Miss Nothing.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-5 md:mt-7 text-base sm:text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed font-light"
        >
          The intelligent job tracking system built for serious candidates.
          Never lose track of where you applied again.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-9 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/register"
            className="glass-cta group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white"
          >
            <span className="relative z-10">Start Tracking</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <a
            href="#demo"
            className="glass-btn group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 text-sm sm:text-base font-medium rounded-2xl text-white/60 hover:text-white"
          >
            <Play className="w-4 h-4" />
            View Demo
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-14 md:mt-20 flex items-center justify-center gap-5"
        >
          <div className="flex -space-x-2.5">
            {["A", "B", "C", "D", "E"].map((letter, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 flex items-center justify-center text-[10px] text-white/40 font-medium backdrop-blur-sm"
              >
                {letter}
              </div>
            ))}
          </div>
          <span className="text-xs sm:text-sm text-white/25 font-medium">
            2,400+ job seekers tracking smarter
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border border-white/10 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 rounded-full bg-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
