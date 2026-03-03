"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Loader2,
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  Link2,
  User,
  Mail,
  Phone,
  Tag,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateApplication } from "@/server/actions";
import { useAppStore } from "@/hooks/use-store";
import { toast } from "sonner";
import type { Application, Interview } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

interface EditApplicationModalProps {
  application: AppWithInterviews;
  open: boolean;
  onClose: () => void;
}

export function EditApplicationModal({
  application,
  open,
  onClose,
}: EditApplicationModalProps) {
  const [isPending, startTransition] = useTransition();
  const { updateApplication: updateLocal } = useAppStore();

  const [formData, setFormData] = useState({
    companyName: application.companyName,
    positionTitle: application.positionTitle,
    platform: application.platform,
    jobType: application.jobType,
    salaryMin: application.salaryMin?.toString() || "",
    salaryMax: application.salaryMax?.toString() || "",
    location: application.location || "",
    priority: application.priority,
    recruiterName: application.recruiterName || "",
    recruiterEmail: application.recruiterEmail || "",
    recruiterPhone: application.recruiterPhone || "",
    jobLink: application.jobLink || "",
    resumeVersion: application.resumeVersion || "",
    notes: application.notes || "",
    tags: application.tags.join(", "),
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const tags = formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const result = await updateApplication({
          id: application.id,
          companyName: formData.companyName,
          positionTitle: formData.positionTitle,
          platform: formData.platform,
          jobType: formData.jobType,
          salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
          salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
          location: formData.location || null,
          priority: formData.priority,
          recruiterName: formData.recruiterName || null,
          recruiterEmail: formData.recruiterEmail || null,
          recruiterPhone: formData.recruiterPhone || null,
          jobLink: formData.jobLink || null,
          resumeVersion: formData.resumeVersion || null,
          notes: formData.notes || null,
          tags,
        });

        if (result && "success" in result && result.success) {
          updateLocal(application.id, result.data as Partial<Application>);
          toast.success("Application updated successfully");
          onClose();
        }
      } catch {
        toast.error("Failed to update application");
      }
    });
  };

  if (!open) return null;

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
          className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-bold">Edit Application</h2>
              <p className="text-sm text-muted-foreground">
                Update details for {application.companyName}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Company & Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Company Name
                </Label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="e.g. Google"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  Position Title
                </Label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.positionTitle}
                  onChange={(e) => handleChange("positionTitle", e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </div>
            </div>

            {/* Platform, Job Type, Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(v) => handleChange("platform", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                    <SelectItem value="INDEED">Indeed</SelectItem>
                    <SelectItem value="REFERRAL">Referral</SelectItem>
                    <SelectItem value="DIRECT">Direct</SelectItem>
                    <SelectItem value="GLASSDOOR">Glassdoor</SelectItem>
                    <SelectItem value="ANGELLIST">AngelList</SelectItem>
                    <SelectItem value="COMPANY_WEBSITE">Company Website</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Job Type</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(v) => handleChange("jobType", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                    <SelectItem value="ONSITE">Onsite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => handleChange("priority", v)}
                >
                  <SelectTrigger>
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

            {/* Salary & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  Min Salary
                </Label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.salaryMin}
                  onChange={(e) => handleChange("salaryMin", e.target.value)}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  Max Salary
                </Label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.salaryMax}
                  onChange={(e) => handleChange("salaryMax", e.target.value)}
                  placeholder="80000"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  Location
                </Label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g. New York, NY"
                />
              </div>
            </div>

            {/* Recruiter Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Recruiter Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Name
                  </Label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.recruiterName}
                    onChange={(e) =>
                      handleChange("recruiterName", e.target.value)
                    }
                    placeholder="Recruiter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    Email
                  </Label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.recruiterEmail}
                    onChange={(e) =>
                      handleChange("recruiterEmail", e.target.value)
                    }
                    placeholder="email@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Phone
                  </Label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.recruiterPhone}
                    onChange={(e) =>
                      handleChange("recruiterPhone", e.target.value)
                    }
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>

            {/* Job Link, Resume, Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Job Link
                </Label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.jobLink}
                  onChange={(e) => handleChange("jobLink", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Resume Version
                </Label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.resumeVersion}
                  onChange={(e) =>
                    handleChange("resumeVersion", e.target.value)
                  }
                  placeholder="v2.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                Tags
              </Label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="react, typescript, startup (comma separated)"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Notes</Label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px] resize-y"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any additional notes..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border-t border-border px-6 py-4 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isPending || !formData.companyName || !formData.positionTitle
              }
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
