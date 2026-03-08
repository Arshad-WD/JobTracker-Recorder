"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, X, Menu, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Navbar() {
  const { status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 inset-x-0 mx-auto z-50 w-[95%] max-w-4xl"
      >
        <div
          className={`glass-bubble-nav transition-all duration-500 ${
            scrolled
              ? "bg-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
              : "bg-white/[0.03]"
          }`}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all group-hover:scale-105">
                <Briefcase className="w-4 h-4 text-white" />
                {/* Shine overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/25 to-transparent" />
              </div>
              <span className="text-base font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                JobTracker
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-3.5 py-1.5 text-[13px] text-white/50 hover:text-white transition-all rounded-full hover:bg-white/[0.06] font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2.5">
              {status === "authenticated" ? (
                <Link
                  href="/dashboard"
                  className="glass-cta px-4 py-2 text-[13px] font-medium text-white flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 text-[13px] text-white/50 hover:text-white transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="glass-cta px-4 py-2 text-[13px] font-medium text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              onClick={() => setMobileOpen(false)}
            />

            {/* Content */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative pt-24 px-6"
            >
              <div className="glass-bubble-lg p-6">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => setMobileOpen(false)}
                      className="text-base py-3 px-4 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2.5">
                  {status === "authenticated" ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="glass-cta w-full py-3 text-center font-medium text-white flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="w-full py-3 text-center text-white/60 glass-btn rounded-xl font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="glass-cta w-full py-3 text-center font-semibold text-white"
                      >
                        Get Started Free
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
