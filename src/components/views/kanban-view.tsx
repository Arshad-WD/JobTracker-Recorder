"use client";

import React, { useCallback, useTransition } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  getStatusLabel,
  getPlatformLabel,
  formatDate,
  calculateApplicationScore,
  cn,
} from "@/lib/utils";
import { ArrowRight } from "lucide-react";

import { updateApplicationStatus } from "@/server/actions";
import { useAppStore } from "@/hooks/use-store";
import { toast } from "sonner";
import type { Application, Interview, ApplicationStatus } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

const COLUMNS: { id: ApplicationStatus; label: string; color: string; glow: string }[] = [
  { id: "APPLIED", label: "Applied", color: "border-hologram-cyan/50", glow: "shadow-[0_0_15px_rgba(6,182,212,0.2)]" },
  { id: "SCREENING", label: "Screening", color: "border-amber-500/50", glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]" },
  { id: "INTERVIEW", label: "Interview", color: "border-hologram-indigo/50", glow: "shadow-[0_0_15px_rgba(79,70,229,0.2)]" },
  { id: "OFFER", label: "Offer", color: "border-green-500/50", glow: "shadow-[0_0_15px_rgba(34,197,94,0.2)]" },
  { id: "REJECTED", label: "Rejected", color: "border-red-500/50", glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]" },
  { id: "GHOSTED", label: "Ghosted", color: "border-white/20", glow: "shadow-none" },
];

interface KanbanViewProps {
  applications: AppWithInterviews[];
  onSelect: (_id: string) => void;
}

export function KanbanView({ applications, onSelect }: KanbanViewProps) {
  const { updateApplication } = useAppStore();
  const [_isPending, startTransition] = useTransition();

  const getColumnApps = useCallback(
    (status: ApplicationStatus) =>
      applications.filter((app) => app.status === status),
    [applications]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const appId = result.draggableId;
      const newStatus = result.destination.droppableId as ApplicationStatus;

      // Optimistic update
      updateApplication(appId, { status: newStatus });

      startTransition(async () => {
        try {
          await updateApplicationStatus(appId, newStatus);
          toast.success(`Moved to ${getStatusLabel(newStatus)}`);
        } catch {
          toast.error("Failed to update status");
        }
      });
    },
    [updateApplication]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 custom-scrollbar">
        {COLUMNS.map((column) => {
          const columnApps = getColumnApps(column.id);
          return (
            <div
              key={column.id}
              className={cn(
                "flex-shrink-0 w-80 bg-hologram-glass/40 backdrop-blur-xl border border-hologram-border flex flex-col h-fit min-h-[500px] rounded-2xl overflow-hidden",
                column.glow
              )}
            >
              {/* Column header */}
              <div className={cn("p-4 border-b border-hologram-border bg-white/5 flex items-center justify-between", column.color)}>
                <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/80">
                  {column.label}
                </h3>
                <span className="font-mono text-[10px] font-bold text-hologram-cyan/60">
                  {columnApps.length.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Column content */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 p-3 space-y-4 transition-colors",
                      snapshot.isDraggingOver ? "bg-hologram-cyan/5" : "bg-transparent"
                    )}
                  >
                    {columnApps.length === 0 && !snapshot.isDraggingOver && (
                      <div className="py-20 text-center opacity-10">
                         <p className="font-mono text-[8px] uppercase tracking-widest leading-relaxed">
                            NO_TARGETS_IN_VECTOR<br/>(AWAITING_DATA)
                         </p>
                      </div>
                    )}
                    
                    {columnApps.map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "transition-transform",
                              snapshot.isDragging ? "z-50 rotate-2 scale-105" : ""
                            )}
                            onClick={() => onSelect(app.id)}
                          >
                            <div className={cn(
                                "bg-hologram-glass/60 backdrop-blur-md border p-4 relative group transition-all rounded-xl",
                                snapshot.isDragging 
                                  ? "border-hologram-cyan shadow-[0_0_30px_rgba(6,182,212,0.3)]" 
                                  : "border-hologram-border hover:border-hologram-cyan/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                             )}>
                                {/* Glass shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                               <div className="flex items-start justify-between mb-3 relative z-10">
                                  <h4 className="text-sm font-black uppercase tracking-tight truncate max-w-[160px] text-white group-hover:text-hologram-cyan transition-colors hologram-heading">
                                     {app.companyName}
                                  </h4>
                                  <span className="font-mono text-[8px] text-hologram-cyan bg-hologram-cyan/10 border border-hologram-cyan/30 px-1.5 py-0.5 rounded-sm">
                                     {calculateApplicationScore(app)}%
                                  </span>
                               </div>
                               
                               <p className="font-mono text-[10px] text-white/50 uppercase truncate mb-4 relative z-10">
                                  {app.positionTitle}
                               </p>

                               <div className="flex items-center gap-2 flex-wrap relative z-10">
                                  <span className="font-mono text-[8px] px-2 py-0.5 bg-white/5 text-white/60 uppercase rounded-md border border-white/10">
                                     {getPlatformLabel(app.platform)}
                                  </span>
                                  {app.priority === "HIGH" && (
                                     <span className="font-mono text-[8px] px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 font-bold uppercase rounded-md shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                        PRIORITY_HIGH
                                     </span>
                                  )}
                               </div>
                               
                               <div className="mt-4 pt-4 border-t border-hologram-border flex justify-between items-center relative z-10">
                                  <span className="font-mono text-[8px] text-white/30 uppercase">
                                     {formatDate(app.appliedDate)}
                                  </span>
                                  <ArrowRight className="h-3 w-3 text-hologram-cyan/40 group-hover:text-hologram-cyan group-hover:translate-x-0.5 transition-all" />
                               </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
