"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  FileText,
  Target,
  MessageSquare,
  AlertCircle,
  Settings,
} from "lucide-react";
import type { Application } from "@prisma/client";
import MonolithButton from "@/components/neon/MonolithButton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AIAssistantModalProps {
  application: Application;
  open: boolean;
  onClose: () => void;
}

type TabType = "cover_letter" | "resume_tips" | "interview_tips";

const TABS: { id: TabType; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: "cover_letter",
    label: "Cover Letter",
    icon: FileText,
    description: "Generate a tailored cover letter",
  },
  {
    id: "resume_tips",
    label: "Resume Tips",
    icon: Target,
    description: "Get role-specific resume advice",
  },
  {
    id: "interview_tips",
    label: "Interview Tips",
    icon: MessageSquare,
    description: "Prepare for your interview",
  },
];

export function AIAssistantModal({
  application,
  open,
  onClose,
}: AIAssistantModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("cover_letter");
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateContent = async (type: TabType) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          companyName: application.companyName,
          positionTitle: application.positionTitle,
          jobType: application.jobType,
          notes: application.notes || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "AI not configured") {
          setError("configure");
        } else {
          setError(data.message || "Failed to generate content");
        }
        return;
      }

      setContent((prev) => ({ ...prev, [type]: data.content }));
    } catch {
      setError("Failed to connect to AI service");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleCopy = async () => {
    const text = content[activeTab];
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  const currentContent = content[activeTab];
  const isLoading = loading[activeTab];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-3xl max-h-[85vh] overflow-hidden bg-hologram-glass/40 backdrop-blur-xl border border-hologram-border rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glass shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-hologram-cyan/5 pointer-events-none rounded-[2rem]" />
          
          {/* Header */}
          <div className="border-b border-hologram-border/50 px-8 py-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-hologram-cyan/10 border border-hologram-cyan/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Sparkles className="h-7 w-7 text-hologram-cyan animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white hologram-heading">AI_ASSISTANT</h2>
                <div className="flex items-center gap-2 mt-1">
                   <span className="font-mono text-[9px] text-hologram-cyan/60 uppercase tracking-widest">{application.companyName}</span>
                   <span className="text-white/20">|</span>
                   <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">{application.positionTitle}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="h-10 w-10 border border-hologram-border/50 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 hover:border-hologram-border transition-all group"
            >
              <X className="h-5 w-5 text-white/40 group-hover:text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-hologram-border/50 px-8 py-3 flex gap-2 overflow-x-auto relative z-10">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                  activeTab === tab.id
                    ? "bg-hologram-cyan/10 text-hologram-cyan border border-hologram-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : "text-white/40 border border-transparent hover:bg-white/5"
                )}
              >
                <tab.icon className={cn("h-4 w-4 transition-colors", activeTab === tab.id ? "text-hologram-cyan" : "text-white/20")} />
                {tab.label}
              </button>
            ))}
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 relative z-10">
            {error === "configure" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="h-20 w-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Settings className="h-10 w-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white hologram-heading">AI_NOT_CONFIGURED</h3>
                <p className="font-mono text-[10px] text-white/40 max-w-sm uppercase leading-relaxed tracking-wider">
                  LINK_AI_PROVIDER_IN_SYSTEM_SETTINGS_TO_ACTIVATE_SYNAPSE_MODELS
                </p>
                <MonolithButton
                  onClick={() => (window.location.href = "/settings")}
                  className="px-8"
                >
                  OPEN_SETTINGS
                </MonolithButton>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="font-mono text-xs text-red-400/60 uppercase tracking-widest">{error}</p>
                <button
                  onClick={() => generateContent(activeTab)}
                  className="px-6 py-2 border border-hologram-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/5 transition-all"
                >
                  REBOOT_SEQUENCE
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-8">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 border-[3px] border-hologram-cyan border-t-transparent animate-spin rounded-full" />
                  <div className="absolute inset-4 border-[2px] border-hologram-indigo border-b-transparent animate-spin-reverse rounded-full" />
                  <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-hologram-cyan animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-black text-xl uppercase tracking-[0.2em] text-white animate-pulse">SYNTHESIZING_DATA</p>
                  <p className="font-mono text-[10px] text-hologram-cyan/40 uppercase tracking-widest">ANALYZING_ROLE // TAILORING_OUTPUT</p>
                </div>
              </div>
            ) : currentContent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-none"
              >
                <div className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed bg-white/[0.03] rounded-2xl p-8 border border-hologram-border/50 text-white/80 shadow-inner">
                  {currentContent}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="h-24 w-24 rounded-[2rem] bg-hologram-indigo/10 border border-hologram-indigo/30 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                  {React.createElement(
                    TABS.find((t) => t.id === activeTab)?.icon || Sparkles,
                    { className: "h-10 w-10 text-hologram-indigo" }
                  )}
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white hologram-heading">
                    {TABS.find((t) => t.id === activeTab)?.label}_READY
                  </h3>
                  <p className="font-mono text-[10px] text-white/40 max-w-sm uppercase leading-relaxed tracking-wider">
                    {TABS.find((t) => t.id === activeTab)?.description} {"//"} TARGET: {application.positionTitle}
                  </p>
                </div>
                <MonolithButton
                  onClick={() => generateContent(activeTab)}
                  glitch
                  className="px-10 py-4 text-lg"
                >
                  INITIALIZE_GEN
                </MonolithButton>
              </div>
            )}
          </div>

          {/* Footer */}
          {currentContent && !isLoading && (
            <div className="border-t border-hologram-border/50 px-8 py-5 flex items-center justify-between relative z-10 bg-black/40 backdrop-blur-md">
              <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                [SYSTEM_NOTE]: AI_GENERATED_CONTENT // REVIEW_BEFORE_DEPLOY
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => generateContent(activeTab)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-hologram-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  REGENERATE
                </button>
                <MonolithButton
                  onClick={handleCopy}
                  className="h-10 px-6 rounded-xl text-[10px]"
                >
                  {copied ? "COPIED_OK" : "COPY_TO_CLIPBOARD"}
                </MonolithButton>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
