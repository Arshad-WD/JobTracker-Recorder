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
    label: "Technical",
    icon: Cpu,
    desc: "Coding & algorithms",
    gradient: "from-blue-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.15)",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/15",
    ring: "ring-blue-500/20",
  },
  {
    id: "behavioral",
    label: "Behavioral",
    icon: Users,
    desc: "STAR method prep",
    gradient: "from-emerald-500 to-green-500",
    glow: "rgba(16, 185, 129, 0.15)",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/15",
    ring: "ring-emerald-500/20",
  },
  {
    id: "system_design",
    label: "System Design",
    icon: Brain,
    desc: "Architecture questions",
    gradient: "from-violet-500 to-purple-500",
    glow: "rgba(139, 92, 246, 0.15)",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/15",
    ring: "ring-violet-500/20",
  },
  {
    id: "culture_fit",
    label: "Culture Fit",
    icon: Heart,
    desc: "Values & team fit",
    gradient: "from-pink-500 to-rose-500",
    glow: "rgba(236, 72, 153, 0.15)",
    text: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/15",
    ring: "ring-pink-500/20",
  },
];

const difficultyStyles: Record<string, string> = {
  Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/15",
  Hard: "bg-rose-500/10 text-rose-400 border-rose-500/15",
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
  const [isPending, startTransition] = useTransition();

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
      toast.error("Please select an application first");
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "AI not configured") {
          setError("configure");
        } else {
          setError(data.message || "Failed to generate");
        }
        return;
      }

      setContent((prev) => ({
        ...prev,
        [`${selectedAppId}-${selectedCategory}`]: data.content,
      }));
      setExpandedQ(null);
    } catch {
      setError("Failed to connect to AI");
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
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Interview Prep</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-14">
            AI-powered questions tailored to your applications
          </p>
        </div>
      </div>

      {/* Application Selector — Glass Bubble */}
      <div className="glass-bubble p-5 sm:p-6" style={{ borderRadius: "20px" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-white/40" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-1">
                Target Application
              </p>
              <Select value={selectedAppId} onValueChange={setSelectedAppId}>
                <SelectTrigger className="w-[280px] sm:w-[340px] border-white/10 bg-white/[0.03] text-sm">
                  <SelectValue placeholder="Select an application..." />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.companyName} — {app.positionTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedApp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/30 font-medium">
                {selectedApp.status}
              </span>
              {selectedApp.jobType && (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/30 font-medium">
                  {selectedApp.jobType}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Category Grid — Glass Bubbles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={`relative glass-bubble-sm p-4 text-left transition-all duration-300 overflow-hidden ${
              selectedCategory === cat.id
                ? `ring-1 ${cat.ring} bg-white/[0.05]`
                : "hover:bg-white/[0.03]"
            }`}
          >
            {/* Active glow */}
            {selectedCategory === cat.id && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 30% 20%, ${cat.glow}, transparent 70%)`,
                }}
              />
            )}

            <div className="relative">
              <div
                className={`h-10 w-10 rounded-xl ${cat.bg} ${cat.border} border flex items-center justify-center mb-3 transition-transform duration-300 ${
                  selectedCategory === cat.id ? "scale-110" : ""
                }`}
              >
                <cat.icon className={`h-5 w-5 ${cat.text}`} />
              </div>
              <p className="font-semibold text-sm text-white/80">{cat.label}</p>
              <p className="text-[11px] text-white/30 mt-0.5">{cat.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Content Area — Glass Bubble */}
      <div className="glass-bubble-lg p-6 sm:p-8 min-h-[350px] relative overflow-hidden">
        {/* Background glow matching category */}
        <div
          className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[100px] pointer-events-none opacity-30"
          style={{
            background: currentCat.glow.replace("0.15", "0.08"),
          }}
        />

        <div className="relative">
          {error === "configure" ? (
            /* AI Not Configured */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-14 text-center space-y-5"
            >
              <div className="glass-bubble w-20 h-20 flex items-center justify-center">
                <Settings className="h-9 w-9 text-amber-400/60" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white/80">
                  AI Not Configured
                </h3>
                <p className="text-sm text-white/30 max-w-sm">
                  Set up your AI provider in Settings to generate interview
                  questions.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/settings")}
                className="gap-2 glass-btn text-white/60 hover:text-white border-white/10"
              >
                <Settings className="h-4 w-4" />
                Go to Settings
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          ) : error ? (
            /* Error State */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-14 text-center space-y-4"
            >
              <div className="glass-bubble w-16 h-16 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-rose-400/60" />
              </div>
              <p className="text-sm text-white/40">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={generateQuestions}
                className="gap-1.5 glass-btn text-white/60 hover:text-white border-white/10"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try Again
              </Button>
            </motion.div>
          ) : loading ? (
            /* Loading State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-5"
            >
              <div className="relative">
                <div className="w-20 h-20 glass-bubble flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white/40 animate-spin" />
                </div>
                {/* Orbiting dot */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div
                    className={`absolute -top-1 left-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-r ${currentCat.gradient} shadow-lg`}
                  />
                </motion.div>
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-sm font-medium text-white/60">
                  Generating {currentCat.label} questions...
                </p>
                <p className="text-xs text-white/25">
                  Tailored for{" "}
                  {selectedApp
                    ? `${selectedApp.companyName} — ${selectedApp.positionTitle}`
                    : "..."}
                </p>
              </div>
            </motion.div>
          ) : parsedQuestions.length > 0 ? (
            /* Parsed Questions — Card Layout */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg ${currentCat.bg} ${currentCat.border} border flex items-center justify-center`}
                  >
                    <Sparkles className={`h-4 w-4 ${currentCat.text}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white/70">
                      {currentCat.label} Questions
                    </h3>
                    <p className="text-[11px] text-white/25">
                      {selectedApp?.companyName} · {parsedQuestions.length}{" "}
                      questions
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateQuestions}
                    className="gap-1.5 glass-btn text-white/50 hover:text-white border-white/10 text-xs h-8"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Regenerate
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 glass-cta text-white text-xs h-8 !rounded-xl"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copied!" : "Copy All"}
                  </Button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {parsedQuestions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-bubble-sm overflow-hidden group transition-all duration-300 hover:bg-white/[0.03]"
                  >
                    {/* Question header — always visible */}
                    <button
                      onClick={() =>
                        setExpandedQ(expandedQ === i ? null : i)
                      }
                      className="w-full flex items-start gap-3.5 p-4 text-left"
                    >
                      <span
                        className={`flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold shrink-0 mt-0.5 bg-gradient-to-br ${currentCat.gradient} text-white shadow-sm`}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/70 leading-relaxed pr-4">
                          {q.question || q.title}
                        </p>
                        {q.difficulty && (
                          <span
                            className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${difficultyStyles[q.difficulty]}`}
                          >
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-white/20 shrink-0 mt-1 transition-transform duration-300 ${
                          expandedQ === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandedQ === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 ml-[42px] space-y-3 border-t border-white/[0.04] pt-3">
                            {q.hint && (
                              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/[0.08]">
                                <Lightbulb className="w-4 h-4 text-amber-400/60 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-200/50 leading-relaxed">
                                  {q.hint}
                                </p>
                              </div>
                            )}
                            {q.extras.length > 0 && (
                              <div className="space-y-1.5">
                                {q.extras.map((extra, j) => (
                                  <div
                                    key={j}
                                    className="flex items-start gap-2 text-xs text-white/30 leading-relaxed"
                                  >
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-white/15 shrink-0" />
                                    {extra}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : currentContent ? (
            /* Fallback: raw text if parsing failed */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-white/70">
                  <Sparkles className={`h-4 w-4 ${currentCat.text}`} />
                  {currentCat.label} Questions — {selectedApp?.companyName}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateQuestions}
                    className="gap-1.5 glass-btn text-white/50 hover:text-white border-white/10 text-xs h-8"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Regenerate
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 glass-cta text-white text-xs h-8 !rounded-xl"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed glass-bubble-sm p-5 text-white/40">
                {currentContent}
              </div>
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-5"
            >
              <div className="glass-bubble w-20 h-20 flex items-center justify-center relative">
                <BookOpen className="h-9 w-9 text-white/20" />
                {/* Decorative mini bubbles */}
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white/[0.03] border border-white/[0.06]" />
                <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-white/[0.02] border border-white/[0.05]" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-white/70">
                  Ready to Practice?
                </h3>
                <p className="text-sm text-white/30 max-w-sm">
                  {selectedApp
                    ? `Generate ${currentCat.label} questions for ${selectedApp.companyName}`
                    : "Select an application above to get started"}
                </p>
              </div>
              <Button
                onClick={generateQuestions}
                disabled={!selectedAppId || isPending}
                className="gap-2 glass-cta text-white font-semibold !rounded-2xl px-6 py-2.5"
              >
                <Sparkles className="h-4 w-4" />
                Generate Questions
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
