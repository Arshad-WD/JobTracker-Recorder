"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  FileText,
  Target,
  MessageSquare,
  Mail,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Application } from "@prisma/client";

interface AIAssistantModalProps {
  application: Application;
  open: boolean;
  onClose: () => void;
}

type TabType = "cover_letter" | "resume_tips" | "interview_tips" | "follow_up_email";

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
  {
    id: "follow_up_email",
    label: "Follow-Up",
    icon: Mail,
    description: "Draft a professional follow-up",
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
          className="w-full max-w-3xl max-h-[85vh] overflow-hidden bg-card border border-border rounded-2xl shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  {application.companyName} — {application.positionTitle}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-border px-6 py-2 flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error === "configure" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <Settings className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold">AI Not Configured</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Set up your AI provider and API key in{" "}
                  <a href="/settings" className="text-primary underline">
                    Settings
                  </a>{" "}
                  to use AI features. Supports Gemini, GPT, Claude, OpenRouter, and
                  HuggingFace.
                </p>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/settings")}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Go to Settings
                </Button>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <AlertCircle className="h-12 w-12 text-destructive/60" />
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateContent(activeTab)}
                >
                  Try Again
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-2 border-primary/20 animate-pulse" />
                  <Loader2 className="h-8 w-8 text-primary animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">Generating {TABS.find((t) => t.id === activeTab)?.label}...</p>
                  <p className="text-xs text-muted-foreground">This may take a few seconds</p>
                </div>
              </div>
            ) : currentContent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-sm dark:prose-invert max-w-none"
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 rounded-xl p-5 border border-border/50">
                  {currentContent}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center">
                  {React.createElement(
                    TABS.find((t) => t.id === activeTab)?.icon || Sparkles,
                    { className: "h-10 w-10 text-primary/60" }
                  )}
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">
                    {TABS.find((t) => t.id === activeTab)?.label}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {TABS.find((t) => t.id === activeTab)?.description} for{" "}
                    <span className="font-medium text-foreground">
                      {application.positionTitle}
                    </span>{" "}
                    at{" "}
                    <span className="font-medium text-foreground">
                      {application.companyName}
                    </span>
                  </p>
                </div>
                <Button
                  onClick={() => generateContent(activeTab)}
                  className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {currentContent && !isLoading && (
            <div className="border-t border-border px-6 py-3 flex items-center justify-between bg-card/95">
              <p className="text-xs text-muted-foreground">
                AI-generated content — review before using
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateContent(activeTab)}
                  className="gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
