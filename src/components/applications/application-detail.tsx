"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  getPlatformLabel,
  getJobTypeLabel,
  formatDate,
  formatCurrency,
  calculateApplicationScore,
  cn,
} from "@/lib/utils";
import MonolithButton from "@/components/neon/MonolithButton";
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
  const [_isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(application.notes || "");
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [application.id]);

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
        className="fixed right-0 top-0 z-[70] h-full w-full max-w-xl border-l border-hologram-border bg-hologram-glass/95 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-hologram-cyan/5 via-transparent to-hologram-indigo/5 pointer-events-none" />
        <ScrollArea viewportRef={scrollRef} className="h-full relative z-10">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between bg-white/5 p-8 -mx-8 -mt-8 border-b border-hologram-border backdrop-blur-md relative z-20">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 border border-hologram-cyan/50 bg-hologram-cyan/10 flex items-center justify-center text-hologram-cyan text-3xl font-black rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  {application.companyName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-none mb-2 hologram-heading">
                    {application.companyName}
                  </h2>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan/60">
                    TARGET_ENTRY // {application.positionTitle}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 rounded-xl text-white/40 hover:text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Status & Technical Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 border border-hologram-border bg-white/5 space-y-3 rounded-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-hologram-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="font-mono text-[8px] text-hologram-cyan uppercase tracking-[0.3em] font-bold relative z-10">NODE_STATUS</span>
                  <Select value={application.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full h-10 border-hologram-border/50 bg-transparent rounded-xl font-bold uppercase tracking-widest text-[10px] relative z-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-hologram-glass backdrop-blur-xl border border-hologram-border rounded-xl">
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
               
               <div className="p-4 border border-hologram-border bg-white/5 space-y-3 rounded-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-hologram-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="font-mono text-[8px] text-hologram-indigo uppercase tracking-[0.3em] font-bold relative z-10">PRIORITY_VECTOR</span>
                  <div className="flex h-10 items-center justify-center border-hologram-border/50 border rounded-xl font-bold uppercase tracking-widest text-[10px] bg-white/5 relative z-10 text-white">
                     {application.priority}
                  </div>
               </div>
            </div>

            {/* System Score Readout */}
            <div className="p-8 border border-hologram-indigo/50 bg-hologram-indigo/10 rounded-2xl space-y-6 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-hologram-indigo/20 to-transparent opacity-40" />
               <div className="flex justify-between items-end relative z-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-hologram-indigo">COMPUTED_MATCH_INDEX</h4>
                  <span className="text-4xl font-black text-white tracking-tighter hologram-heading">{score}%</span>
               </div>
               <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    className="h-full bg-gradient-to-r from-hologram-indigo to-hologram-cyan shadow-[0_0_20px_#818cf8]"
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
                  variant="green"
                  className="px-3 py-1.5 text-[10px]"
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
                  <MonolithButton type="submit" variant="violet" glitch className="w-full">
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
              <MonolithButton variant="green" onClick={() => setShowEditModal(true)}>
                CONFIG_EDIT
              </MonolithButton>
              <MonolithButton variant="green" className="border-violet-500/50 text-violet-400" onClick={() => setShowAIModal(true)}>
                AI_ANALYZE
              </MonolithButton>
              <MonolithButton variant="green" onClick={handleArchive}>
                ARCHIVE_DATA
              </MonolithButton>
              <MonolithButton variant="green" className="border-[#EF4444]/50 text-[#EF4444]" onClick={handleDelete}>
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
    <div className="space-y-1 group/stat">
      <p className="font-mono text-[8px] text-hologram-cyan/30 uppercase tracking-[0.3em] font-bold group-hover/stat:text-hologram-cyan/60 transition-colors">{label}</p>
      <p className="text-[11px] font-bold uppercase tracking-widest text-white/80 transition-colors group-hover/stat:text-white truncate border-b border-hologram-border pb-1.5">
        {value || "NULL_VALUE"}
      </p>
    </div>
  );
}
