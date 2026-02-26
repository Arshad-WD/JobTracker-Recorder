"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";

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
  { company: "Google", role: "Sr. Software Engineer", recruiter: "Sarah Johnson", phone: "+1-650-555-0101", status: "Interview" },
  { company: "Stripe", role: "Full Stack Developer", recruiter: "Mike Chen", phone: "+1-415-555-0202", status: "Screening" },
];

export function DemoSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeDemo, setActiveDemo] = useState<"kanban" | "search">("kanban");

  useEffect(() => {
    // Auto-type demo
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
    <section id="demo" className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-xs sm:text-sm font-medium text-violet-400 uppercase tracking-widest">
            Interactive Demo
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            See it in action
          </h2>
        </motion.div>

        {/* Demo toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1">
            {(["kanban", "search"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDemo(tab)}
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeDemo === tab
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-white/50 hover:text-white/70"
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
          className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 rounded-md bg-white/5 text-xs text-white/30">
                app.jobtracker.com
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 min-h-[300px] md:min-h-[400px]">
            {activeDemo === "kanban" ? (
              /* KANBAN DEMO */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {Object.entries(kanbanData).map(([status, cards]) => (
                  <div key={status} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            status === "Applied"
                              ? "#3b82f6"
                              : status === "Interview"
                              ? "#8b5cf6"
                              : "#22c55e",
                        }}
                      />
                      <span className="text-sm font-medium text-white/70">{status}</span>
                      <span className="ml-auto text-xs text-white/30">{cards.length}</span>
                    </div>
                    <div className="space-y-2">
                      {cards.map((card, i) => (
                        <motion.div
                          key={card.company}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 + 0.3 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="rounded-lg bg-white/[0.04] border border-white/5 p-3 cursor-pointer hover:border-white/10 transition-all"
                        >
                          <div className="text-sm font-medium text-white/80">
                            {card.company}
                          </div>
                          <div className="text-xs text-white/40 mt-0.5">{card.role}</div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: card.color }}
                            />
                            <span className="text-[10px] text-white/30">Active</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* SEARCH DEMO */
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md">
                  {/* Search input */}
                  <div className="relative mb-6">
                    <div className="rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 flex items-center gap-3">
                      <span className="text-white/30">🔍</span>
                      <span className="text-sm text-white/70 font-mono">
                        {searchQuery}
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 align-middle"
                        />
                      </span>
                    </div>
                  </div>

                  {/* Results */}
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {searchResults
                        .filter((r) =>
                          r.company.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((result) => (
                          <motion.div
                            key={result.company}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-xl bg-white/[0.04] border border-white/10 p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-base font-semibold text-white/80">
                                {result.company}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                                {result.status}
                              </span>
                            </div>
                            <div className="text-sm text-white/50">{result.role}</div>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/40">
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
