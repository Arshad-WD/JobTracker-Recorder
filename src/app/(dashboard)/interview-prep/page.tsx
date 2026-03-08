"use client";

import React, { useEffect, useState, useTransition, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Settings,
  AlertCircle,
  Brain,
  Users,
  Cpu,
  Heart,
  ChevronDown,
  RotateCcw,
  BookOpen,
  Target,
  Lightbulb,
  ArrowRight,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApplications } from "@/server/actions";
import { toast } from "sonner";
import type { Application, Interview } from "@prisma/client";
import MonolithButton from "@/components/neon/MonolithButton";
import { cn } from "@/lib/utils";

type AppWithInterviews = Application & { interviews: Interview[] };

/* ---------- parsed question types ---------- */
interface ParsedQuestion {
  title: string;
  question: string;
  hint?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  extras: string[];
}

function parseQuestions(raw: string): ParsedQuestion[] {
  const blocks = raw.split(/\n(?=\d+\.\s|\#{1,3}\s)/).filter(Boolean);
  const questions: ParsedQuestion[] = [];

  for (const block of blocks) {
    const lines = block.trim().split("\n").filter(Boolean);
    if (lines.length === 0) continue;

    const titleLine = lines[0].replace(/^[\d#.*]+[\s.:)]+/, "").replace(/\*\*/g, "").trim();
    if (!titleLine) continue;

    let question = "";
    let hint = "";
    let difficulty: "Easy" | "Medium" | "Hard" | undefined;
    const extras: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      const lower = line.toLowerCase();

      if (lower.startsWith("- **question") || lower.startsWith("**question")) {
        question = line.replace(/^-?\s*\*\*question\*\*:?\s*/i, "").replace(/\*\*/g, "");
      } else if (lower.startsWith("- **hint") || lower.startsWith("**hint")) {
        hint = line.replace(/^-?\s*\*\*hint\*\*:?\s*/i, "").replace(/\*\*/g, "");
      } else if (lower.startsWith("- **difficulty") || lower.startsWith("**difficulty")) {
        const d = line.replace(/^-?\s*\*\*difficulty\*\*:?\s*/i, "").replace(/\*\*/g, "").trim();
        if (d === "Easy" || d === "Medium" || d === "Hard") difficulty = d;
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        extras.push(line.replace(/^[-*]\s+/, "").replace(/\*\*/g, ""));
      } else {
        extras.push(line.replace(/\*\*/g, ""));
      }
    }

    questions.push({
      title: titleLine,
      question: question || titleLine,
      hint,
      difficulty,
      extras: extras.filter(Boolean),
    });
  }

  return questions.length > 0 ? questions : [];
}

const CATEGORIES = [
  {
    id: "technical",
    label: "TECHNICAL_CORE",
    icon: Cpu,
    desc: "LOGIC & ALGORITHMS",
    color: "#8B5CF6",
    bg: "bg-[#8B5CF6]/5",
    border: "border-[#8B5CF6]",
  },
  {
    id: "behavioral",
    label: "BEHAVIORAL_DRIVE",
    icon: Users,
    desc: "STAR PROTOCOL PREP",
    color: "#22C55E",
    bg: "bg-[#22C55E]/5",
    border: "border-[#22C55E]",
  },
  {
    id: "system_design",
    label: "SYS_ARCHITECTURE",
    icon: Brain,
    desc: "INFRASTRUCTURE DESIGN",
    color: "#8B5CF6",
    bg: "bg-[#8B5CF6]/5",
    border: "border-[#8B5CF6]",
  },
  {
    id: "culture_fit",
    label: "CULTURE_SYNC",
    icon: Heart,
    desc: "VALUES & TEAM FIT",
    color: "#EF4444",
    bg: "bg-[#EF4444]/5",
    border: "border-[#EF4444]",
  },
];

const difficultyStyles: Record<string, string> = {
  Easy: "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5",
  Medium: "border-[#FBBF24] text-[#FBBF24] bg-[#FBBF24]/5",
  Hard: "border-[#EF4444] text-[#EF4444] bg-[#EF4444]/5",
};

export default function InterviewPrepPage() {
  const [applications, setApplications] = useState<AppWithInterviews[]>([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("technical");
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeExpanded, setResumeExpanded] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setResumeText(ev.target?.result as string);
        setResumeFileName(file.name);
        setResumeExpanded(true);
        toast.success("RESUME_LOADED");
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/pdf-parse", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setResumeText(data.text);
          setResumeFileName(file.name);
          setResumeExpanded(true);
          toast.success("PDF_RESUME_PARSED");
        } else {
          toast.error(data.error || "FAILED_PARSE");
        }
      } catch (err) {
        toast.error("INTERFACE_ERROR");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("UNSUPPORTED_TYPE");
    }
    e.target.value = "";
  };

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getApplications(false);
        setApplications(data as AppWithInterviews[]);
      } catch {}
    });
  }, []);

  const selectedApp = applications.find((a) => a.id === selectedAppId);
  const currentCat = CATEGORIES.find((c) => c.id === selectedCategory)!;
  const currentContent = content[`${selectedAppId}-${selectedCategory}`];
  const parsedQuestions = useMemo(
    () => (currentContent ? parseQuestions(currentContent) : []),
    [currentContent]
  );

  const generateQuestions = async () => {
    if (!selectedApp) {
      toast.error("SELECT_TARGET_UNIT");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: selectedApp.companyName,
          positionTitle: selectedApp.positionTitle,
          category: selectedCategory,
          jobType: selectedApp.jobType,
          notes: selectedApp.notes || "",
          resumeText: resumeText.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "AI not configured") {
          setError("configure");
        } else {
          setError(data.message || "GENERATION_FAILURE");
        }
        return;
      }

      setContent((prev) => ({
        ...prev,
        [`${selectedAppId}-${selectedCategory}`]: data.content,
      }));
      setExpandedQ(null);
    } catch {
      setError("AI_CONNECTION_LOST");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const key = `${selectedAppId}-${selectedCategory}`;
    const text = content[key];
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("DATA_COPIED");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-[3px] border-white pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
            INTERVIEW_PREP_ENGINE
          </h1>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-4">
            AI_DRIVEN_SCENARIO_GENERATOR // STATUS: READY
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target Selector */}
          <div className="border-[3px] border-white bg-black p-6 relative overflow-hidden group">
            <div className="monolith-scanlines" />
            <div className="relative z-10 space-y-4">
              <label className="font-mono text-[10px] font-black uppercase tracking-widest text-white/40 block">TARGET_APPLICATION</label>
              <Select value={selectedAppId} onValueChange={setSelectedAppId}>
                <SelectTrigger className="w-full bg-black border-[2px] border-white/20 h-14 rounded-none font-mono text-xs uppercase hover:border-white transition-colors">
                  <SelectValue placeholder="SELECT_UNIT..." />
                </SelectTrigger>
                <SelectContent className="bg-black border-[2px] border-white rounded-none">
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id} className="font-mono text-xs uppercase hover:bg-white hover:text-black rounded-none">
                      {app.companyName} // {app.positionTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedApp && (
                <div className="flex gap-2 pt-2">
                   <span className="text-[9px] font-black px-2 py-0.5 border border-[#8B5CF6] text-[#8B5CF6] uppercase tracking-widest bg-[#8B5CF6]/5">
                      {selectedApp.status}
                   </span>
                   <span className="text-[9px] font-black px-2 py-0.5 border border-white/20 text-white/40 uppercase tracking-widest bg-white/5">
                      {selectedApp.jobType}
                   </span>
                </div>
              )}
            </div>
          </div>

          {/* Resume Block */}
          <div className="border-[3px] border-white bg-black p-6 relative overflow-hidden group">
            <div className="monolith-scanlines" />
            <div className="relative z-10 space-y-4">
               <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] font-black uppercase tracking-widest text-white/40 block">RESUME_BUFFER</label>
                  {resumeText && <span className="text-[8px] font-black text-[#22C55E] animate-pulse">LOADED_OK</span>}
               </div>
               
               <div className="relative group">
                 <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full bg-black border-[2px] border-white/20 p-4 h-40 font-mono text-[11px] text-white/60 outline-none focus:border-[#8B5CF6] transition-colors rounded-none resize-none"
                    placeholder="PASTE_RESUME_DATA_OR_UPLOAD_BELOW..."
                 />
                 <div className="absolute bottom-2 right-2 flex gap-2">
                    <label className="h-8 w-8 border border-white/20 flex items-center justify-center bg-black hover:bg-white hover:text-black cursor-pointer transition-all">
                       <Upload className="h-3.5 w-3.5" />
                       <input type="file" accept=".txt,.text,.pdf" onChange={handleFileUpload} className="hidden" />
                    </label>
                    {resumeText && (
                      <button onClick={() => setResumeText("")} className="h-8 w-8 border border-white/20 flex items-center justify-center bg-black hover:bg-[#EF4444] hover:text-white transition-all">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                 </div>
               </div>
            </div>
          </div>

          <MonolithButton 
            onClick={generateQuestions} 
            disabled={!selectedAppId || loading} 
            glitch 
            className="w-full text-lg py-5"
          >
            {loading ? "PROCESSING..." : "RUN_PREP_SIMULATION"}
          </MonolithButton>
        </div>

        {/* Right Column: Categories & Output */}
        <div className="lg:col-span-8 space-y-8">
          {/* Category Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "border-[3px] p-4 text-left relative overflow-hidden transition-all hover:-translate-y-1",
                  selectedCategory === cat.id ? "border-white bg-white text-black" : "border-white/10 bg-black text-white/40"
                )}
              >
                <div className="monolith-scanlines rounded-none opacity-20" />
                <div className="relative z-10">
                  <cat.icon className={cn("h-5 w-5 mb-2", selectedCategory === cat.id ? "text-black" : "")} />
                  <p className="font-black text-[10px] uppercase tracking-tighter">{cat.label}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Output Terminal */}
          <div className="border-[3px] border-white bg-black min-h-[500px] relative overflow-hidden">
             <div className="monolith-scanlines rounded-none" />
             <div className="relative z-10 p-8">
                {error === "configure" ? (
                  <div className="py-20 flex flex-col items-center text-center space-y-6">
                     <Settings className="h-16 w-16 text-white/20" />
                     <h3 className="text-xl font-black uppercase tracking-widest">AI_CONFIG_ERROR</h3>
                     <p className="font-mono text-xs text-white/40 max-w-xs uppercase">LINK_AI_PROVIDER_IN_SYSTEM_SETTINGS_TO_PROCEED</p>
                     <MonolithButton onClick={() => window.location.href = "/settings"} variant="black">OPEN_SETTINGS</MonolithButton>
                  </div>
                ) : loading ? (
                  <div className="py-20 flex flex-col items-center text-center space-y-8 text-[#8B5CF6]">
                     <div className="relative h-24 w-24">
                        <div className="absolute inset-0 border-[4px] border-[#8B5CF6] border-t-transparent animate-spin" />
                        <div className="absolute inset-4 border-[2px] border-[#8B5CF6] border-b-transparent animate-spin-reverse" />
                        <Cpu className="absolute inset-0 m-auto h-8 w-8" />
                     </div>
                     <div className="space-y-2">
                        <p className="font-black text-2xl uppercase tracking-widest animate-pulse">COMPUTING_SCENARIOS</p>
                        <p className="font-mono text-xs text-white/40 uppercase tracking-widest">ANALYZING_JOB_SPEC // TAILORING_QUESTIONS</p>
                     </div>
                  </div>
                ) : parsedQuestions.length > 0 ? (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 border-[2px] border-[#8B5CF6] flex items-center justify-center text-[#8B5CF6]">
                             <Sparkles className="h-5 w-5" />
                          </div>
                          <div>
                             <h2 className="text-xl font-black uppercase tracking-tight">{currentCat.label}_ROUTINE</h2>
                             <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.2em]">{parsedQuestions.length} VECTORS_IDENTIFIED</p>
                          </div>
                       </div>
                       <MonolithButton onClick={handleCopy} variant="black" className="h-10 px-4 text-xs">COPY_DATA</MonolithButton>
                    </div>

                    <div className="space-y-4">
                       {parsedQuestions.map((q, i) => (
                         <div key={i} className="border-[2px] border-white/10 bg-black overflow-hidden hover:border-[#8B5CF6] transition-all group">
                            <button
                               onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                               className="w-full text-left p-6 flex gap-6 items-start"
                            >
                               <span className="font-black text-2xl text-white/10 group-hover:text-[#8B5CF6] transition-colors">{(i + 1).toString().padStart(2, '0')}</span>
                               <div className="flex-1 space-y-3">
                                  <p className="text-sm font-black uppercase tracking-tight leading-relaxed">{q.question || q.title}</p>
                                  {q.difficulty && (
                                    <span className={cn("inline-block px-3 py-0.5 border-[2px] text-[8px] font-black uppercase tracking-widest", difficultyStyles[q.difficulty])}>
                                        {q.difficulty}_LEVEL
                                    </span>
                                  )}
                               </div>
                               <ChevronDown className={cn("h-4 w-4 text-white/20 transition-transform", expandedQ === i ? "rotate-180" : "")} />
                            </button>
                            <AnimatePresence>
                               {expandedQ === i && (
                                 <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden border-t-[2px] border-white/10"
                                 >
                                    <div className="p-6 bg-white/[0.02] space-y-6">
                                       {q.hint && (
                                          <div className="border-l-[4px] border-[#FBBF24] p-4 bg-[#FBBF24]/5">
                                             <p className="text-[8px] font-mono font-black text-[#FBBF24] uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Lightbulb className="h-3 w-3" /> INTEL_HINT
                                             </p>
                                             <p className="text-xs font-mono text-white/60 leading-relaxed uppercase">{q.hint}</p>
                                          </div>
                                       )}
                                       {q.extras.length > 0 && (
                                          <div className="space-y-3">
                                             <p className="text-[8px] font-mono font-black text-white/20 uppercase tracking-widest">SUPPLEMENTARY_DATA_POINTS</p>
                                             <div className="grid grid-cols-1 gap-2">
                                                {q.extras.map((extra, j) => (
                                                  <div key={j} className="flex items-start gap-3 p-3 bg-white/5 border border-white/5">
                                                     <div className="w-1 h-1 bg-[#8B5CF6] mt-1.5" />
                                                     <p className="text-[10px] font-mono text-white/40 uppercase">{extra}</p>
                                                  </div>
                                                ))}
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                 </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center text-center space-y-6">
                     <BookOpen className="h-16 w-16 text-white/20" />
                     <h3 className="text-xl font-black uppercase tracking-widest">READY_FOR_SIMULATION</h3>
                     <p className="font-mono text-xs text-white/40 max-w-xs uppercase">SELECT_UNIT_AND_INITIALIZE_TO_GENERATE_TRAINING_SCENARIOS</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
