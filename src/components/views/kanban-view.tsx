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

const COLUMNS: { id: ApplicationStatus; label: string; color: string }[] = [
  { id: "APPLIED", label: "Applied", color: "border-t-blue-500" },
  { id: "SCREENING", label: "Screening", color: "border-t-yellow-500" },
  { id: "INTERVIEW", label: "Interview", color: "border-t-purple-500" },
  { id: "OFFER", label: "Offer", color: "border-t-green-500" },
  { id: "REJECTED", label: "Rejected", color: "border-t-red-500" },
  { id: "GHOSTED", label: "Ghosted", color: "border-t-gray-500" },
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
              className="flex-shrink-0 w-80 bg-black border-[3px] border-white flex flex-col h-fit min-h-[500px]"
            >
              {/* Column header */}
              <div className="p-4 border-b-[3px] border-white bg-white flex items-center justify-between">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-black">
                  {column.label}_NODE
                </h3>
                <span className="font-mono text-[10px] font-black text-black/40">
                  [{columnApps.length.toString().padStart(2, '0')}]
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
                      snapshot.isDraggingOver ? "bg-[#8B5CF6]/10" : "bg-transparent"
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
                              "bg-black border-[2px] p-4 relative group hover:border-[#8B5CF6] transition-colors",
                              snapshot.isDragging ? "border-[#8B5CF6] shadow-[8px_8px_0px_#22C55E]" : "border-white/20"
                            )}>
                               <div className="flex items-start justify-between mb-3">
                                  <h4 className="text-sm font-black uppercase tracking-tighter truncate max-w-[160px]">
                                     {app.companyName}
                                  </h4>
                                  <span className="font-mono text-[8px] text-[#8B5CF6] border border-[#8B5CF6] px-1.5 py-0.5">
                                     SC_{calculateApplicationScore(app)}
                                  </span>
                               </div>
                               
                               <p className="font-mono text-[10px] text-white/40 uppercase truncate mb-4">
                                  {app.positionTitle}
                               </p>

                               <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-[8px] px-2 py-0.5 bg-white/5 text-white/60 uppercase">
                                     {getPlatformLabel(app.platform)}
                                  </span>
                                  {app.priority === "HIGH" && (
                                     <span className="font-mono text-[8px] px-2 py-0.5 bg-[#EF4444] text-black font-black uppercase">
                                        PRIORITY_HIGH
                                     </span>
                                  )}
                               </div>
                               
                               <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                  <span className="font-mono text-[8px] text-white/20 uppercase">
                                     {formatDate(app.appliedDate)}
                                  </span>
                                  <ArrowRight className="h-3 w-3 text-white/10 group-hover:text-white transition-colors" />
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
