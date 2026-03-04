"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const kanbanData = {
  Applied: [
    { company: "Amazon", role: "SDE II", color: "#f59e0b" },
    { company: "Vercel", role: "Frontend Eng", color: "#06b6d4" },
  ],
  Interview: [
    { company: "Google", role: "Sr. SWE", color: "#22c55e" },
  ],
  Offer: [
    { company: "Acme Corp", role: "Tech Lead", color: "#8b5cf6" },
  ],
};

const searchResults = [
  {
    company: "Google",
    role: "Sr. Software Engineer",
    recruiter: "Sarah Johnson",
    phone: "+1-650-555-0101",
    status: "Interview",
  },
  {
    company: "Stripe",
    role: "Full Stack Developer",
    recruiter: "Mike Chen",
    phone: "+1-415-555-0202",
    status: "Screening",
  },
];

export function DemoSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeDemo, setActiveDemo] = useState<"kanban" | "search">("kanban");

  useEffect(() => {
    if (activeDemo !== "search") return;
    const text = "Google";
    let i = 0;
    setSearchQuery("");
    setShowResults(false);

    const interval = setInterval(() => {
      if (i < text.length) {
        setSearchQuery(text.slice(0, i + 1));
        i++;
      } else {
        setShowResults(true);
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [activeDemo]);

  return (
    <section id="demo" className="relative py-24 md:py-36 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 glass-bubble-sm text-[11px] font-semibold text-cyan-400 uppercase tracking-[0.15em] mb-4">
            Interactive Demo
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
            See it in action
          </h2>
        </motion.div>

        {/* Demo toggle */}
        <div className="flex justify-center mb-8">
          <div className="glass-bubble-sm p-1 inline-flex">
            {(["kanban", "search"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDemo(tab)}
                className={`px-5 sm:px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeDemo === tab
                    ? "glass-cta text-white shadow-lg !rounded-xl"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {tab === "kanban" ? "Kanban Board" : "Quick Search"}
              </button>
            ))}
          </div>
        </div>

        {/* Demo card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-bubble-lg overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.04]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/[0.06] border border-white/[0.08]" />
              <div className="w-3 h-3 rounded-full bg-white/[0.06] border border-white/[0.08]" />
              <div className="w-3 h-3 rounded-full bg-white/[0.06] border border-white/[0.08]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-6 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-white/20 font-mono">
                app.jobtracker.com
              </div>
            </div>
          </div>

          <div className="p-5 md:p-8 min-h-[300px] md:min-h-[400px]">
            {activeDemo === "kanban" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {Object.entries(kanbanData).map(([status, cards]) => (
                  <div
                    key={status}
                    className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-3.5"
                  >
                    <div className="flex items-center gap-2 mb-3.5">
                      <div
                        className="w-2 h-2 rounded-full shadow-lg"
                        style={{
                          backgroundColor:
                            status === "Applied"
                              ? "#06b6d4"
                              : status === "Interview"
                              ? "#8b5cf6"
                              : "#22c55e",
                          boxShadow: `0 0 8px ${
                            status === "Applied"
                              ? "rgba(6,182,212,0.4)"
                              : status === "Interview"
                              ? "rgba(139,92,246,0.4)"
                              : "rgba(34,197,94,0.4)"
                          }`,
                        }}
                      />
                      <span className="text-sm font-medium text-white/50">
                        {status}
                      </span>
                      <span className="ml-auto text-[11px] text-white/20">
                        {cards.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {cards.map((card, i) => (
                        <motion.div
                          key={card.company}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 + 0.3 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="glass-bubble-sm p-3 cursor-pointer hover:bg-white/[0.04] transition-all"
                        >
                          <div className="text-sm font-medium text-white/70">
                            {card.company}
                          </div>
                          <div className="text-xs text-white/30 mt-0.5">
                            {card.role}
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: card.color }}
                            />
                            <span className="text-[10px] text-white/20">
                              Active
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md">
                  <div className="relative mb-6">
                    <div className="glass-bubble px-5 py-3.5 flex items-center gap-3">
                      <span className="text-white/20">🔍</span>
                      <span className="text-sm text-white/60 font-mono">
                        {searchQuery}
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                          }}
                          className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 align-middle"
                        />
                      </span>
                    </div>
                  </div>

                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {searchResults
                        .filter((r) =>
                          r.company
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map((result) => (
                          <motion.div
                            key={result.company}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-bubble p-5"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-base font-semibold text-white/70">
                                {result.company}
                              </span>
                              <span className="text-[11px] px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/15 text-violet-300 font-medium">
                                {result.status}
                              </span>
                            </div>
                            <div className="text-sm text-white/40">
                              {result.role}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/30">
                              <span>👤 {result.recruiter}</span>
                              <span>📞 {result.phone}</span>
                            </div>
                          </motion.div>
                        ))}
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
