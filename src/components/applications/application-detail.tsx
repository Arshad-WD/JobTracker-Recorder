"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  User,
  Phone,
  Mail,
  FileText,
  Archive,
  Trash2,
  Loader2,
  Plus,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStatusLabel,
  getPriorityColor,
  getPlatformLabel,
  getJobTypeLabel,
  formatDate,
  formatCurrency,
  calculateApplicationScore,
} from "@/lib/utils";
import {
  updateApplication,
  deleteApplication,
  archiveApplication,
  createInterview,
} from "@/server/actions";
import { useAppStore } from "@/hooks/use-store";
import { toast } from "sonner";
import type { Application, Interview, ApplicationStatus } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

interface ApplicationDetailProps {
  application: AppWithInterviews;
  onClose: () => void;
}

export function ApplicationDetail({ application, onClose }: ApplicationDetailProps) {
  const { updateApplication: optimisticUpdate, removeApplication } = useAppStore();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(application.notes || "");
  const [showInterviewForm, setShowInterviewForm] = useState(false);

  const handleStatusChange = (status: string) => {
    optimisticUpdate(application.id, { status: status as ApplicationStatus });
    startTransition(async () => {
      try {
        await updateApplication({ id: application.id, status });
        toast.success(`Status updated to ${getStatusLabel(status)}`);
      } catch {
        toast.error("Failed to update status");
      }
    });
  };

  const handleSaveNotes = () => {
    startTransition(async () => {
      try {
        await updateApplication({ id: application.id, notes });
        toast.success("Notes saved");
      } catch {
        toast.error("Failed to save notes");
      }
    });
  };

  const handleDelete = () => {
    removeApplication(application.id);
    onClose();
    startTransition(async () => {
      try {
        await deleteApplication(application.id);
        toast.success("Application deleted");
      } catch {
        toast.error("Failed to delete");
      }
    });
  };

  const handleArchive = () => {
    optimisticUpdate(application.id, { archived: true });
    onClose();
    startTransition(async () => {
      try {
        await archiveApplication(application.id, true);
        toast.success("Application archived");
      } catch {
        toast.error("Failed to archive");
      }
    });
  };

  const handleAddInterview = (formData: FormData) => {
    const data = {
      applicationId: application.id,
      roundNumber: parseInt(formData.get("roundNumber") as string) || 1,
      type: formData.get("type") as string || "HR",
      notes: formData.get("notes") as string || "",
    };
    startTransition(async () => {
      try {
        await createInterview(data);
        setShowInterviewForm(false);
        toast.success("Interview round added");
      } catch {
        toast.error("Failed to add interview");
      }
    });
  };

  const score = calculateApplicationScore(application);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-xl border-l bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="font-bold">{application.companyName.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{application.companyName}</h2>
                    <p className="text-sm text-muted-foreground">{application.positionTitle}</p>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Status & Score */}
            <div className="flex items-center gap-3">
              <Select value={application.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="SCREENING">Screening</SelectItem>
                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                  <SelectItem value="OFFER">Offer</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="GHOSTED">Ghosted</SelectItem>
                  <SelectItem value="NO_CONFIRMATION">No Confirmation</SelectItem>
                </SelectContent>
              </Select>
              <Badge className={getPriorityColor(application.priority)} variant="outline">
                {application.priority}
              </Badge>
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-xs text-muted-foreground">Score</span>
                <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
                <span className="text-sm font-medium">{score}</span>
              </div>
            </div>

            <Separator />

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <DetailItem icon={MapPin} label="Location" value={application.location} />
              <DetailItem icon={Briefcase} label="Type" value={getJobTypeLabel(application.jobType)} />
              <DetailItem icon={Calendar} label="Applied" value={formatDate(application.appliedDate)} />
              <DetailItem
                icon={Calendar}
                label="Follow-up"
                value={application.followUpDate ? formatDate(application.followUpDate) : "Not set"}
              />
              <DetailItem
                label="Salary"
                value={
                  application.salaryMin && application.salaryMax
                    ? `${formatCurrency(application.salaryMin)} - ${formatCurrency(application.salaryMax)}`
                    : "-"
                }
              />
              <DetailItem label="Platform" value={getPlatformLabel(application.platform)} />
              <DetailItem icon={FileText} label="Resume" value={application.resumeVersion || "-"} />
              {application.jobLink && (
                <a href={application.jobLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  Job Link
                </a>
              )}
            </div>

            {/* Tags */}
            {application.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex gap-1.5 flex-wrap">
                    {application.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Recruiter Info */}
            {(application.recruiterName || application.recruiterEmail || application.recruiterPhone) && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Recruiter</h3>
                  <div className="space-y-1.5 text-sm">
                    {application.recruiterName && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        {application.recruiterName}
                      </div>
                    )}
                    {application.recruiterEmail && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {application.recruiterEmail}
                      </div>
                    )}
                    {application.recruiterPhone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {application.recruiterPhone}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Interviews */}
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Interview Rounds</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setShowInterviewForm(!showInterviewForm)}
                >
                  <Plus className="h-3 w-3" />
                  Add Round
                </Button>
              </div>

              {showInterviewForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  action={handleAddInterview}
                  className="mb-3 p-3 rounded-lg border bg-muted/30 space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Round #</Label>
                      <Input
                        name="roundNumber"
                        type="number"
                        defaultValue={application.interviews.length + 1}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Type</Label>
                      <select name="type" className="w-full h-8 rounded-md border bg-background px-2 text-sm">
                        <option value="HR">HR</option>
                        <option value="TECHNICAL">Technical</option>
                        <option value="MANAGERIAL">Managerial</option>
                        <option value="ASSIGNMENT">Assignment</option>
                        <option value="CULTURE_FIT">Culture Fit</option>
                        <option value="SYSTEM_DESIGN">System Design</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Notes</Label>
                    <Input name="notes" placeholder="Optional notes..." className="h-8" />
                  </div>
                  <Button type="submit" size="sm" disabled={isPending}>
                    {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                    Save
                  </Button>
                </motion.form>
              )}

              {application.interviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No interview rounds yet</p>
              ) : (
                <div className="space-y-2">
                  {application.interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          R{interview.roundNumber}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{interview.type}</p>
                          {interview.scheduledAt && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(interview.scheduledAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          interview.result === "PASSED"
                            ? "text-green-400 border-green-500/30"
                            : interview.result === "FAILED"
                            ? "text-red-400 border-red-500/30"
                            : "text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {interview.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2">Notes</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes..."
                rows={4}
                className="resize-none"
              />
              <Button
                size="sm"
                className="mt-2"
                onClick={handleSaveNotes}
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                Save Notes
              </Button>
            </div>

            {/* Actions */}
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleArchive}>
                <Archive className="h-4 w-4" />
                Archive
              </Button>
              <Button variant="destructive" className="gap-2" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}
