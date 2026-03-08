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
  Pencil,
  Sparkles,
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
import { EditApplicationModal } from "./edit-application-modal";
import { AIAssistantModal } from "./ai-assistant-modal";

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

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
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 z-[70] h-full w-full max-w-xl border-l-[3px] border-white bg-black shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="monolith-scanlines rounded-none" />
        <ScrollArea className="h-full relative z-10">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between bg-white p-6 -mx-8 -mt-8 border-b-[3px] border-black">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 border-[3px] border-black bg-black flex items-center justify-center text-white text-3xl font-black">
                  {application.companyName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-black leading-none mb-1">
                    {application.companyName}
                  </h2>
                  <p className="text-[10px] font-mono font-black uppercase tracking-widest text-black/40">
                    TARGET_ENTRY // {application.positionTitle}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-black/5 rounded-none">
                <X className="h-6 w-6 text-black" />
              </Button>
            </div>

            {/* Status & Technical Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 border-[2px] border-white/10 bg-white/5 space-y-2">
                  <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em]">NODE_STATUS</span>
                  <Select value={application.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full h-10 border-white/20 bg-transparent rounded-none font-black uppercase tracking-widest text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[2px] border-white rounded-none">
                      <SelectItem value="APPLIED">APPLIED</SelectItem>
                      <SelectItem value="SCREENING">SCREENING</SelectItem>
                      <SelectItem value="INTERVIEW">INTERVIEW</SelectItem>
                      <SelectItem value="OFFER">OFFER</SelectItem>
                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                      <SelectItem value="GHOSTED">GHOSTED</SelectItem>
                      <SelectItem value="NO_CONFIRMATION">NO_CONFIRMATION</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               
               <div className="p-4 border-[2px] border-white/10 bg-white/5 space-y-2">
                  <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em]">PRIORITY_VECTOR</span>
                  <div className="flex h-10 items-center justify-center border-white/20 border-2 font-black uppercase tracking-widest text-[10px] bg-white/5">
                     {application.priority}
                  </div>
               </div>
            </div>

            {/* System Score Readout */}
            <div className="p-6 border-[3px] border-[#8B5CF6] bg-[#8B5CF6]/5 space-y-4">
               <div className="flex justify-between items-end">
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#8B5CF6]">COMPUTED_MATCH_INDEX</h4>
                  <span className="text-4xl font-black text-[#8B5CF6] tracking-tighter">{score}%</span>
               </div>
               <div className="h-4 w-full border border-[#8B5CF6]/30 bg-black p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    className="h-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]"
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pb-4">
               <TechnicalStat label="LOCATION_ID" value={application.location} />
               <TechnicalStat label="DEPLOY_TYPE" value={getJobTypeLabel(application.jobType)} />
               <TechnicalStat label="DATA_LOADED" value={formatDate(application.appliedDate)} />
               <TechnicalStat label="FOLLOW_UP_SYNC" value={application.followUpDate ? formatDate(application.followUpDate) : "OFFLINE"} />
               <TechnicalStat label="RESOURCE_VAL" value={application.salaryMin && application.salaryMax ? `${formatCurrency(application.salaryMin)}-${formatCurrency(application.salaryMax)}` : "UNDISCLOSED"} />
               <TechnicalStat label="UPSTREAM_SRC" value={getPlatformLabel(application.platform)} />
            </div>

            {/* Tags */}
            {application.tags.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">SYSTEM_TAGS</h3>
                <div className="flex gap-2 flex-wrap">
                  {application.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] px-3 py-1 bg-white/5 border border-white/20 text-white uppercase font-black">
                       {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interview Protocol */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">INTERVIEW_PROTOCOL</h3>
                <MonolithButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowInterviewForm(!showInterviewForm)}
                >
                  ADD_PHASE
                </MonolithButton>
              </div>

              {showInterviewForm && (
                <motion.form
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  action={handleAddInterview}
                  className="p-6 border-[2px] border-[#22C55E]/30 bg-[#22C55E]/5 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-mono text-[8px] uppercase text-white/40">PHASE_INDEX</Label>
                      <Input
                        name="roundNumber"
                        type="number"
                        defaultValue={application.interviews.length + 1}
                        className="bg-black border-white/20 rounded-none h-10 font-mono text-xs uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                       <Label className="font-mono text-[8px] uppercase text-white/40">PHASE_TYPE</Label>
                       <select name="type" className="w-full h-10 border-white/20 bg-black font-mono text-xs uppercase px-3 outline-none focus:border-[#22C55E]">
                        <option value="HR">HR</option>
                        <option value="TECHNICAL">TECHNICAL</option>
                        <option value="MANAGERIAL">MANAGERIAL</option>
                        <option value="ASSIGNMENT">ASSIGNMENT</option>
                        <option value="CULTURE_FIT">CULTURE_FIT</option>
                        <option value="SYSTEM_DESIGN">SYSTEM_DESIGN</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-mono text-[8px] uppercase text-white/40">DIRECTIVE_NOTES</Label>
                    <Input name="notes" placeholder="SYSTEM_REMARKS..." className="bg-black border-white/20 rounded-none h-10 font-mono text-xs uppercase" />
                  </div>
                  <MonolithButton type="submit" variant="primary" glitch className="w-full">
                    COMMIT_PHASE
                  </MonolithButton>
                </motion.form>
              )}

              <div className="space-y-3">
                {application.interviews.map((interview) => (
                  <div key={interview.id} className="p-4 border-[2px] border-white/10 bg-white/5 flex items-center justify-between group hover:border-[#8B5CF6] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 bg-white/10 flex items-center justify-center font-mono text-xs font-black group-hover:bg-[#8B5CF6] group-hover:text-black">
                        P{interview.roundNumber}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">{interview.type}</p>
                        <p className="text-[8px] font-mono text-white/20 uppercase mt-1">
                          {interview.scheduledAt ? formatDate(interview.scheduledAt) : "UNSCHEDULED"}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "font-mono text-[8px] px-2 py-0.5 border font-black uppercase",
                      interview.result === "PASSED" ? "text-[#22C55E] border-[#22C55E]" : "text-[#EF4444] border-[#EF4444]"
                    )}>
                      {interview.result || "AWAITING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Notes */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">SYSTEM_LOG_DATA</h3>
              <div className="relative">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="EXECUTE_LOG_ENTRY..."
                  className="bg-black border-[2px] border-white/20 p-6 font-mono text-xs text-white/80 outline-none focus:border-[#8B5CF6] min-h-[160px] rounded-none underline-offset-8"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                   <div className="w-1 h-1 bg-white/20" />
                   <div className="w-4 h-1 bg-white/20" />
                </div>
              </div>
              <MonolithButton
                className="w-full py-4 font-black"
                onClick={handleSaveNotes}
              >
                SYNC_LOG_BUFFER
              </MonolithButton>
            </div>

            {/* Destruction / System Commands */}
            <div className="pt-8 border-t-[3px] border-white/10 grid grid-cols-2 gap-4">
              <MonolithButton variant="secondary" onClick={() => setShowEditModal(true)}>
                CONFIG_EDIT
              </MonolithButton>
              <MonolithButton variant="secondary" className="border-violet-500/50 text-violet-400" onClick={() => setShowAIModal(true)}>
                AI_ANALYZE
              </MonolithButton>
              <MonolithButton variant="secondary" onClick={handleArchive}>
                ARCHIVE_DATA
              </MonolithButton>
              <MonolithButton variant="secondary" className="border-[#EF4444]/50 text-[#EF4444]" onClick={handleDelete}>
                PURGE_ENTRY
              </MonolithButton>
            </div>
          </div>
        </ScrollArea>
      </motion.div>

      {/* Modals remain standard for now as they are large complex multi-form beasts */}
      <EditApplicationModal
        application={application}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <AIAssistantModal
        application={application}
        open={showAIModal}
        onClose={() => setShowAIModal(false)}
      />
    </AnimatePresence>
  );
}

function TechnicalStat({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em]">{label}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-white truncate border-b border-white/10 pb-1">
        {value || "NULL_VALUE"}
      </p>
    </div>
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
