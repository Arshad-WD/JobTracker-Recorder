"use client";

import React, { useEffect, useState, useTransition } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getApplications } from "@/server/actions";
import { toast } from "sonner";
import type { Application, Interview } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

const CATEGORIES = [
  {
    id: "technical",
    label: "Technical",
    icon: Cpu,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "behavioral",
    label: "Behavioral",
    icon: Users,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    id: "system_design",
    label: "System Design",
    icon: Brain,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "culture_fit",
    label: "Culture Fit",
    icon: Heart,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
];

export default function InterviewPrepPage() {
  const [applications, setApplications] = useState<AppWithInterviews[]>([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("technical");
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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

  const currentContent = content[`${selectedAppId}-${selectedCategory}`];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          Interview Prep
        </h1>
        <p className="text-muted-foreground mt-2">
          AI-powered interview preparation tailored to your applications
        </p>
      </div>

      {/* Selection Controls */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Application</label>
              <Select
                value={selectedAppId}
                onValueChange={setSelectedAppId}
              >
                <SelectTrigger>
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
        </CardContent>
      </Card>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={`p-4 rounded-2xl border transition-all text-left ${
              selectedCategory === cat.id
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border bg-card/50 hover:border-border/80"
            }`}
          >
            <div
              className={`h-10 w-10 rounded-xl ${cat.bgColor} flex items-center justify-center mb-3`}
            >
              <cat.icon className={`h-5 w-5 ${cat.color}`} />
            </div>
            <p className="font-semibold text-sm">{cat.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {cat.id === "technical" && "Coding & algorithms"}
              {cat.id === "behavioral" && "STAR method prep"}
              {cat.id === "system_design" && "Architecture questions"}
              {cat.id === "culture_fit" && "Values & team fit"}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Generate / Content */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm min-h-[300px]">
        <CardContent className="p-6">
          {error === "configure" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Settings className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold">AI Not Configured</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Set up your AI provider in{" "}
                <a href="/settings" className="text-primary underline">
                  Settings
                </a>{" "}
                to generate interview questions.
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
                onClick={generateQuestions}
              >
                Try Again
              </Button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-2 border-primary/20 animate-pulse" />
                <Loader2 className="h-8 w-8 text-primary animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm font-medium">
                Generating{" "}
                {CATEGORIES.find((c) => c.id === selectedCategory)?.label}{" "}
                questions...
              </p>
              <p className="text-xs text-muted-foreground">
                Tailored for{" "}
                {selectedApp
                  ? `${selectedApp.companyName} — ${selectedApp.positionTitle}`
                  : "..."}
              </p>
            </div>
          ) : currentContent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.label}{" "}
                  Questions for {selectedApp?.companyName}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateQuestions}
                    className="gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Regenerate
                  </Button>
                  <Button size="sm" onClick={handleCopy} className="gap-1.5">
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 rounded-xl p-5 border border-border/50">
                {currentContent}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary/40" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Ready to Practice?</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {selectedApp
                    ? `Generate ${
                        CATEGORIES.find((c) => c.id === selectedCategory)
                          ?.label
                      } questions for ${selectedApp.companyName}`
                    : "Select an application above to get started"}
                </p>
              </div>
              <Button
                onClick={generateQuestions}
                disabled={!selectedAppId}
                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                <Sparkles className="h-4 w-4" />
                Generate Questions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
