"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  AlertTriangle,
  Link2,
  Zap,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  applicationCreateSchema,
  type ApplicationCreateInput,
} from "@/lib/validations";
import { createApplication } from "@/server/actions";
import { useAppStore } from "@/hooks/use-store";
import { parseQuickInput } from "@/lib/parse-job-input";

const TAG_OPTIONS = ["Startup", "MNC", "Dream Company", "High Salary", "Referral"];

type AddMode = "quick" | "url" | "manual";

export function QuickAddModal() {
  const { isQuickAddOpen, setQuickAddOpen, addApplication } = useAppStore();
  const [isPending, startTransition] = useTransition();
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mode, setMode] = useState<AddMode>("quick");
  const [quickInput, setQuickInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationCreateInput>({
    resolver: zodResolver(applicationCreateSchema),
    defaultValues: {
      platform: "OTHER",
      jobType: "REMOTE",
      status: "APPLIED",
      priority: "MEDIUM",
      tags: [],
    },
  });

  const watchedCompany = watch("companyName");
  const watchedPlatform = watch("platform");

  // Auto-fetch company logo
  useEffect(() => {
    if (watchedCompany && watchedCompany.length > 2) {
      const domain = watchedCompany.toLowerCase().replace(/\s+/g, "") + ".com";
      setCompanyLogo(`https://logo.clearbit.com/${domain}`);
    } else {
      setCompanyLogo(null);
    }
  }, [watchedCompany]);

  // Auto-show recruiter section when Referral is selected
  useEffect(() => {
    if (watchedPlatform === "REFERRAL") {
      setShowAdvanced(true);
    }
  }, [watchedPlatform]);

  const onSubmit = (data: ApplicationCreateInput) => {
    data.tags = selectedTags;
    // Auto-set follow-up date (14 days from now)
    if (!data.followUpDate) {
      const followUp = new Date();
      followUp.setDate(followUp.getDate() + 14);
    }
    startTransition(async () => {
      try {
        const result = await createApplication(data);
        if (result && "error" in result && result.error === "duplicate") {
          setDuplicateWarning("This company + position already exists!");
          return;
        }
        if (result && "success" in result && result.data) {
          addApplication(result.data as any);
          toast.success("Application added!", {
            description: `${data.companyName} - ${data.positionTitle}`,
          });
          resetForm();
        }
      } catch (error) {
        toast.error("Failed to add application");
      }
    });
  };

  const resetForm = () => {
    reset();
    setSelectedTags([]);
    setDuplicateWarning(null);
    setQuickInput("");
    setUrlInput("");
    setShowAdvanced(false);
    setQuickAddOpen(false);
  };

  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;
    const parsed = parseQuickInput(quickInput);
    if (parsed.companyName) setValue("companyName", parsed.companyName);
    if (parsed.positionTitle) setValue("positionTitle", parsed.positionTitle);
    if (parsed.jobType) setValue("jobType", parsed.jobType);
    if (parsed.salaryMin) setValue("salaryMin", parsed.salaryMin);
    if (parsed.salaryMax) setValue("salaryMax", parsed.salaryMax);
    if (parsed.location) setValue("location", parsed.location);
    if (parsed.platform) setValue("platform", parsed.platform as any);
    setMode("manual");
    toast.success("Fields auto-filled!", { description: "Review and save." });
  };

  const handleUrlParse = async () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    try {
      const res = await fetch(`/api/scrape-job?url=${encodeURIComponent(urlInput)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.company) setValue("companyName", data.company);
        if (data.title) setValue("positionTitle", data.title);
        if (data.location) setValue("location", data.location);
        if (data.jobType) setValue("jobType", data.jobType);
        setValue("jobLink", urlInput);
        setMode("manual");
        toast.success("Job details extracted!", { description: "Review and save." });
      } else {
        // Fallback: just set the link
        setValue("jobLink", urlInput);
        setMode("manual");
        toast.info("Couldn't auto-extract. Please fill in details manually.");
      }
    } catch {
      setValue("jobLink", urlInput);
      setMode("manual");
      toast.info("Couldn't reach the URL. Please fill in details manually.");
    } finally {
      setUrlLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Dialog open={isQuickAddOpen} onOpenChange={setQuickAddOpen}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Application</DialogTitle>
            <DialogDescription className="text-sm">
              Quick add, paste a link, or fill in details manually.
            </DialogDescription>
          </DialogHeader>

          {/* Mode selector */}
          <div className="flex gap-1.5 mt-4 p-1 rounded-xl bg-muted/50">
            {[
              { key: "quick" as const, icon: Zap, label: "Quick Add" },
              { key: "url" as const, icon: Link2, label: "Paste Link" },
              { key: "manual" as const, icon: FileText, label: "Manual" },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  mode === m.key
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <m.icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Quick Add Mode */}
          <AnimatePresence mode="wait">
            {mode === "quick" && (
              <motion.div
                key="quick"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-violet-400" />
                    Type naturally — we&apos;ll parse it
                  </div>
                  <Input
                    placeholder='e.g. "Google SWE Remote 25L" or "Stripe - Backend Dev - $150k"'
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
                    className="h-12 text-base"
                    autoFocus
                  />
                </div>

                {/* Live preview */}
                {quickInput.trim().length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-lg bg-muted/30 border p-3 space-y-1.5"
                  >
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Preview</p>
                    {(() => {
                      const parsed = parseQuickInput(quickInput);
                      return (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          {parsed.companyName && (
                            <div><span className="text-muted-foreground">Company:</span> <span className="font-medium">{parsed.companyName}</span></div>
                          )}
                          {parsed.positionTitle && (
                            <div><span className="text-muted-foreground">Position:</span> <span className="font-medium">{parsed.positionTitle}</span></div>
                          )}
                          {parsed.jobType && (
                            <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{parsed.jobType}</span></div>
                          )}
                          {parsed.salaryMin && (
                            <div><span className="text-muted-foreground">Salary:</span> <span className="font-medium">₹{(parsed.salaryMin/100000).toFixed(1)}L{parsed.salaryMax ? ` - ${(parsed.salaryMax/100000).toFixed(1)}L` : ""}</span></div>
                          )}
                          {parsed.location && (
                            <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{parsed.location}</span></div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                <Button onClick={handleQuickAdd} className="w-full" disabled={!quickInput.trim()}>
                  <Zap className="mr-2 h-4 w-4" />
                  Parse & Fill
                </Button>
              </motion.div>
            )}

            {/* URL Mode */}
            {mode === "url" && (
              <motion.div
                key="url"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Link2 className="h-3 w-3 text-blue-400" />
                    Paste a job listing URL
                  </div>
                  <Input
                    placeholder="https://linkedin.com/jobs/view/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlParse()}
                    className="h-12 text-base"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={handleUrlParse}
                  className="w-full"
                  disabled={!urlInput.trim() || urlLoading}
                >
                  {urlLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="mr-2 h-4 w-4" />
                  )}
                  {urlLoading ? "Extracting..." : "Extract Job Details"}
                </Button>
              </motion.div>
            )}

            {/* Manual Mode */}
            {mode === "manual" && (
              <motion.div
                key="manual"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {duplicateWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm"
                  >
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {duplicateWarning}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Section 1: Essential Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {companyLogo && (
                        <img
                          src={companyLogo}
                          alt=""
                          className="h-8 w-8 rounded-lg border bg-white p-0.5"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="companyName" className="text-xs">Company *</Label>
                          <Input
                            id="companyName"
                            placeholder="Google"
                            {...register("companyName")}
                            className={errors.companyName ? "border-red-500" : ""}
                          />
                          {errors.companyName && (
                            <p className="text-[11px] text-red-500">{errors.companyName.message}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="positionTitle" className="text-xs">Position *</Label>
                          <Input
                            id="positionTitle"
                            placeholder="Software Engineer"
                            {...register("positionTitle")}
                            className={errors.positionTitle ? "border-red-500" : ""}
                          />
                          {errors.positionTitle && (
                            <p className="text-[11px] text-red-500">{errors.positionTitle.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Platform</Label>
                        <Select
                          defaultValue="OTHER"
                          onValueChange={(v) => setValue("platform", v as any)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                            <SelectItem value="INDEED">Indeed</SelectItem>
                            <SelectItem value="REFERRAL">Referral</SelectItem>
                            <SelectItem value="DIRECT">Direct</SelectItem>
                            <SelectItem value="GLASSDOOR">Glassdoor</SelectItem>
                            <SelectItem value="COMPANY_WEBSITE">Company Website</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Job Type</Label>
                        <Select
                          defaultValue="REMOTE"
                          onValueChange={(v) => setValue("jobType", v as any)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="REMOTE">Remote</SelectItem>
                            <SelectItem value="HYBRID">Hybrid</SelectItem>
                            <SelectItem value="ONSITE">Onsite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Priority</Label>
                        <Select
                          defaultValue="MEDIUM"
                          onValueChange={(v) => setValue("priority", v as any)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Tags</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {TAG_OPTIONS.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer transition-all hover:scale-105 text-[11px]"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Advanced section — progressive disclosure */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full py-2"
                    >
                      {showAdvanced ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                      {showAdvanced ? "Less options" : "More options (salary, recruiter, resume...)"}
                    </button>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          {/* Compensation */}
                          <div className="rounded-lg bg-muted/20 p-3 space-y-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Compensation</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <Label htmlFor="salaryMin" className="text-xs">Salary Min</Label>
                                <Input id="salaryMin" type="number" placeholder="50000" {...register("salaryMin")} className="h-9" />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="salaryMax" className="text-xs">Salary Max</Label>
                                <Input id="salaryMax" type="number" placeholder="100000" {...register("salaryMax")} className="h-9" />
                              </div>
                            </div>
                          </div>

                          {/* Location & Link */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="location" className="text-xs">Location</Label>
                              <Input id="location" placeholder="San Francisco" {...register("location")} className="h-9" />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="jobLink" className="text-xs">Job Link</Label>
                              <Input id="jobLink" placeholder="https://..." {...register("jobLink")} className="h-9" />
                            </div>
                          </div>

                          {/* Recruiter */}
                          <div className="rounded-lg bg-muted/20 p-3 space-y-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recruiter</p>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs">Name</Label>
                                <Input placeholder="John Doe" {...register("recruiterName")} className="h-9" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Email</Label>
                                <Input placeholder="john@co.com" {...register("recruiterEmail")} className="h-9" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Phone</Label>
                                <Input placeholder="+1..." {...register("recruiterPhone")} className="h-9" />
                              </div>
                            </div>
                          </div>

                          {/* Resume & Notes */}
                          <div className="space-y-1.5">
                            <Label className="text-xs">Resume Version</Label>
                            <Input placeholder="v2.1 - Frontend Focus" {...register("resumeVersion")} className="h-9" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Notes</Label>
                            <Textarea placeholder="Any notes..." rows={2} {...register("notes")} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                      Save Application
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
