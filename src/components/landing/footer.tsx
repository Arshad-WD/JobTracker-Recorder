"use client";

import Link from "next/link";
import { Briefcase, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04]">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all">
                <Briefcase className="w-4 h-4 text-white" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <span className="text-base font-semibold text-white/60">
                JobTracker
              </span>
            </Link>
            <p className="text-sm text-white/20 max-w-xs leading-relaxed">
              The intelligent job application tracking system for serious
              candidates.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2.5">
              {["Features", "Pricing", "Demo", "Changelog"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-white/20 hover:text-white/50 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/20 hover:text-white/50 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {["Privacy", "Terms", "Security"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/20 hover:text-white/50 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/15">
            © 2026 JobTracker. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-white/15 hover:text-white/40 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-white/15 hover:text-white/40 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
