"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 md:py-36 px-4 sm:px-6 lg:px-8">
      {/* Multi-color orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-violet-500/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-fuchsia-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* Glass bubble wrapper */}
          <div className="glass-bubble-lg p-10 md:p-16 relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 bg-violet-500/[0.06] rounded-full blur-[80px] pointer-events-none" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] mb-5 md:mb-7">
                <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                  Ready to take control of
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  your job search?
                </span>
              </h2>

              <p className="text-base md:text-lg text-white/30 max-w-lg mx-auto mb-9 md:mb-11 font-light">
                Join thousands of smart job seekers who track every application,
                follow up on time, and land offers faster.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/register"
                  className="glass-cta group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 sm:px-11 py-4 text-base font-semibold text-white"
                >
                  <span className="relative z-10">
                    Get Started — It&apos;s Free
                  </span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <p className="mt-5 text-xs text-white/20 font-medium">
                No credit card required · Free plan available
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
