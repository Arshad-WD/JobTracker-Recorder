"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  Lightbulb,
  HelpCircle,
  Gamepad2,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MonolithButton from "@/components/neon/MonolithButton";
import { toast } from "sonner";

interface Question {
  question: string;
  hint: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  extras: { label: string; value: string }[];
}

const CATEGORIES = [
  "General",
  "Technical",
  "Behavioral",
  "System Design",
  "Culture Fit",
];

export default function InterviewPrepPage() {
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [isLoading, setIsLoading] = useState(false);
  const [rawOutput, setRawOutput] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const generateInterviewPrep = async () => {
    if (!position) {
      toast.error("Please enter the target position");
      return;
    }

    setIsLoading(true);
    setRawOutput("");
    setParsedQuestions([]);
    setExpandedQ(null);

    try {
      const response = await fetch("/api/ai/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position,
          description,
          category: selectedCategory,
        }),
      });

      if (!response.ok) throw new Error("Failed to connect to Neural Network");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedOutput = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          accumulatedOutput += chunk;
          setRawOutput(accumulatedOutput);
        }

        // Parse structured output
        try {
          // Attempt to find JSON block in output
          const jsonMatch = accumulatedOutput.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[1]);
            setParsedQuestions(data.questions || []);
          }
        } catch (e) {
          console.error("Failed to parse synaptic data:", e);
        }
      }
    } catch (error) {
      toast.error("SYNAPSE_FAILURE: Could not generate content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      {/* Hero Header */}
      <div className="relative">
        <div className="absolute -left-12 top-0 h-24 w-1 bg-gradient-to-b from-hologram-cyan to-transparent opacity-50" />
        <h1 className="text-5xl font-black uppercase tracking-tighter text-white hologram-heading">
          INTERVIEW_SCENARIOS
        </h1>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] mt-4 flex items-center gap-3">
          <Terminal className="h-3 w-3 text-hologram-cyan" />
          SYNTHETIC_PREP_ENGINE // TACTICAL_RESPONSE_MOCK
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Configuration */}
        <div className="lg:col-span-5 space-y-8">
           <div className="border border-hologram-border bg-hologram-glass/40 backdrop-blur-xl rounded-2xl p-8 space-y-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-hologram-cyan/5 to-transparent pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <Label className="font-mono text-[9px] font-bold uppercase tracking-widest text-hologram-cyan/60">TARGET_POSITION</Label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="E.G. SENIOR_FRONTEND_ENGINEER..."
                    className="w-full bg-white/5 border border-hologram-border/50 h-14 rounded-xl px-4 text-white font-mono text-sm focus:ring-2 focus:ring-hologram-cyan/20 focus:border-hologram-cyan/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="font-mono text-[9px] font-bold uppercase tracking-widest text-hologram-cyan/60">INTEL_CONTEXT (JOB_DESC)</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="PASTE_JD_FOR_HYPER_TARGETED_QUESTIONS..."
                    className="w-full bg-white/5 border border-hologram-border/50 h-40 rounded-xl p-4 text-white font-mono text-sm focus:ring-2 focus:ring-hologram-cyan/20 focus:border-hologram-cyan/50 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="font-mono text-[9px] font-bold uppercase tracking-widest text-hologram-cyan/60">SYNAPSE_CATEGORY</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-lg font-mono text-[9px] uppercase tracking-widest transition-all border",
                          selectedCategory === cat
                            ? "bg-hologram-cyan/10 border-hologram-cyan text-hologram-cyan shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                            : "bg-white/5 border-hologram-border/30 text-white/40 hover:border-white/20 hover:text-white/60"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <MonolithButton
                  onClick={generateInterviewPrep}
                  disabled={isLoading}
                  glitch
                  className="w-full py-5 text-xl mt-4"
                >
                  {isLoading ? "SYNC_PROCESSING..." : "INITIALIZE_SIM"}
                </MonolithButton>
              </div>
           </div>

           {/* Quick Stats / Info */}
           <div className="p-6 border border-hologram-border/20 bg-white/[0.02] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-hologram-indigo/10 border border-hologram-indigo/30 flex items-center justify-center">
                    <Gamepad2 className="h-5 w-5 text-hologram-indigo" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">SIMULATION_READY</h4>
                    <p className="text-[8px] font-mono text-white/30 uppercase">ENGINE_CONNECTED // v4.0.2</p>
                 </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-hologram-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
           </div>
        </div>

        {/* Right Col: Output */}
        <div className="lg:col-span-7">
           {isLoading || parsedQuestions.length > 0 || rawOutput ? (
              <div className="space-y-6">
                 {parsedQuestions.map((q, i) => (
                   <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="border border-hologram-border bg-hologram-glass/40 backdrop-blur-xl rounded-2xl overflow-hidden group shadow-lg"
                   >
                      <button
                        onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                        className="w-full p-8 flex items-start justify-between text-left hover:bg-white/[0.02] transition-colors group/q"
                      >
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <span className="h-7 w-12 border border-hologram-cyan/40 bg-hologram-cyan/5 text-[10px] font-mono font-black text-hologram-cyan flex items-center justify-center rounded-lg">
                                #{String(i + 1).padStart(2, '0')}
                              </span>
                              <span className="px-3 py-1 border border-white/10 text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-white/40 rounded-lg">
                                {selectedCategory}_SYNAPSE
                              </span>
                           </div>
                           <h3 className="text-lg font-black uppercase tracking-tight text-white/90 leading-tight pr-8">
                             {q.question}
                           </h3>
                           {q.difficulty && (
                             <span className={cn(
                               "inline-block px-3 py-1 border text-[8px] font-bold uppercase tracking-[0.2em] rounded-lg", 
                               q.difficulty === "Easy" ? "border-green-500/30 text-green-400 bg-green-500/5" :
                               q.difficulty === "Medium" ? "border-amber-500/30 text-amber-400 bg-amber-500/5" :
                               "border-red-500/30 text-red-400 bg-red-500/5"
                             )}>
                                 {q.difficulty}_LEVEL
                             </span>
                           )}
                        </div>
                        <ChevronDown className={cn("h-6 w-6 text-white/20 transition-all duration-500 group-hover/q:text-white/40 mt-1", expandedQ === i ? "rotate-180" : "")} />
                      </button>

                      <AnimatePresence>
                        {expandedQ === i && (
                          <motion.div
                             initial={{ height: 0 }}
                             animate={{ height: "auto" }}
                             exit={{ height: 0 }}
                             className="overflow-hidden border-t border-hologram-border bg-white/[0.02] rounded-b-2xl"
                          >
                             <div className="p-8 space-y-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-hologram-indigo/5 to-transparent pointer-events-none" />
                                
                                {q.hint && (
                                   <div className="border border-hologram-indigo/20 bg-hologram-indigo/5 rounded-2xl p-6 relative group/hint">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-hologram-indigo/50" />
                                      <p className="text-[10px] font-mono font-black text-hologram-indigo uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                                         <Lightbulb className="h-4 w-4" /> INTEL_HINT
                                      </p>
                                      <p className="font-mono text-[12px] text-white/70 leading-relaxed uppercase">{q.hint}</p>
                                   </div>
                                )}
                                
                                {q.extras.length > 0 && (
                                   <div className="grid grid-cols-2 gap-4">
                                      {q.extras.map((extra, idx) => (
                                         <div key={idx} className="p-5 border border-hologram-border/30 bg-white/5 rounded-2xl group/extra hover:border-hologram-cyan/30 transition-all">
                                            <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">{extra.label}</p>
                                            <p className="text-[11px] font-bold text-hologram-cyan uppercase tracking-wider">{extra.value}</p>
                                         </div>
                                      ))}
                                   </div>
                                )}

                                <MonolithButton className="w-full py-4 text-[10px]">
                                   PRACTICE_REP_SEQUENCE
                                </MonolithButton>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </motion.div>
                 ))}

                 {isLoading && !parsedQuestions.length && (
                   <div className="border border-hologram-border bg-hologram-glass/40 backdrop-blur-xl rounded-2xl p-12 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                      <div className="relative h-20 w-20">
                        <div className="absolute inset-0 border-[3px] border-hologram-cyan border-t-transparent animate-spin rounded-full" />
                        <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-hologram-cyan animate-pulse" />
                      </div>
                      <div className="text-center space-y-2">
                         <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-white animate-pulse">SYNTHESIZING_SCENARIOS</h3>
                         <p className="font-mono text-[10px] text-hologram-cyan/40 uppercase tracking-widest">MAP_REDUCING_INTERVIEW_PATTERNS</p>
                      </div>
                   </div>
                 )}
              </div>
           ) : (
              <div className="border border-dashed border-hologram-border/30 rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-10 group bg-white/[0.01]">
                 <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-hologram-border/20 flex items-center justify-center group-hover:border-hologram-cyan/30 transition-all shadow-inner">
                   <HelpCircle className="h-10 w-10 text-white/20 group-hover:text-hologram-cyan/40 transition-all" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white/40">NO_DATA_STREAMS</h3>
                    <p className="font-mono text-[10px] text-white/20 max-w-xs mx-auto uppercase leading-relaxed tracking-widest">
                       INITIALIZE_CONFIGURATION_ON_THE_LEFT_TO_REVEAL_INTERVIEW_INTEL
                    </p>
                 </div>
                 <div className="flex gap-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-1 w-8 bg-white/5 rounded-full" />
                   ))}
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <label className={cn("block font-medium text-muted-foreground mb-1", className)}>
      {children}
    </label>
  );
}
