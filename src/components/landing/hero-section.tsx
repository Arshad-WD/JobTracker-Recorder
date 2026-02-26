"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[#09090b]" />

        {/* Animated light blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_70%)]" />
      </div>

      {/* Floating glassmorphism cards — CSS only */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {/* Card 1 — Applied */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[8%] md:left-[15%] w-44 md:w-56 p-3 md:p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-2xl hidden sm:block"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            <span className="text-[10px] md:text-xs text-emerald-400 font-medium">Applied</span>
          </div>
          <div className="h-2 w-3/4 rounded bg-white/10 mb-1.5" />
          <div className="h-2 w-1/2 rounded bg-white/5" />
        </motion.div>

        {/* Card 2 — Interview */}
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -1.5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[5%] md:right-[12%] w-48 md:w-60 p-3 md:p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
            <span className="text-[10px] md:text-xs text-violet-400 font-medium">Interview</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-[8px] text-white/50 font-bold">G</div>
            <div>
              <div className="h-2 w-20 rounded bg-white/10 mb-1" />
              <div className="h-1.5 w-14 rounded bg-white/5" />
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
              <span className="text-[8px] text-violet-300">Round 2</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="text-[8px] text-amber-300">Tomorrow</span>
            </div>
          </div>
        </motion.div>

        {/* Card 3 — Offer */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 0.8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[25%] left-[5%] md:left-[10%] w-40 md:w-52 p-3 md:p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-2xl hidden md:block"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
            <span className="text-[10px] md:text-xs text-amber-400 font-medium">Offer 🎉</span>
          </div>
          <div className="h-2 w-2/3 rounded bg-white/10 mb-1.5" />
          <div className="h-2 w-1/2 rounded bg-white/5" />
        </motion.div>

        {/* Card 4 — Stats mini */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[20%] right-[8%] md:right-[15%] w-44 md:w-52 p-3 md:p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-2xl hidden sm:block"
        >
          <div className="text-[10px] text-white/40 mb-2">This Month</div>
          <div className="flex items-end gap-1">
            {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-violet-500/40 to-indigo-500/20"
                style={{ height: `${h * 0.35}px` }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs font-semibold text-white/70">24</span>
            <span className="text-[10px] text-emerald-400">+12%</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-[#09090b] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 md:mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs sm:text-sm text-white/70">
            Intelligent Job Application Tracking
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
        >
          <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            Track Every Application.
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Miss Nothing.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed"
        >
          The intelligent job tracking system built for serious candidates.
          Never lose track of where you applied again.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/register"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Start Tracking</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>

          <a
            href="#demo"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
          >
            <Play className="w-4 h-4" />
            View Demo
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12 md:mt-16 flex items-center justify-center gap-6 text-white/30 text-xs sm:text-sm"
        >
          <div className="flex -space-x-2">
            {["A", "B", "C", "D", "E"].map((letter, i) => (
              <div
                key={i}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-[10px] sm:text-xs text-white/50"
              >
                {letter}
              </div>
            ))}
          </div>
          <span>2,400+ job seekers tracking smarter</span>
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
          className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
