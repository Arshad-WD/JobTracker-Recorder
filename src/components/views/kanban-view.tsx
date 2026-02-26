"use client";

import React, { useCallback, useTransition } from "react";
import { motion } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getStatusColor,
  getStatusLabel,
  getPlatformLabel,
  formatDate,
  calculateApplicationScore,
} from "@/lib/utils";
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
  onSelect: (id: string) => void;
}

export function KanbanView({ applications, onSelect }: KanbanViewProps) {
  const { updateApplication } = useAppStore();
  const [isPending, startTransition] = useTransition();

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
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {COLUMNS.map((column) => {
          const columnApps = getColumnApps(column.id);
          return (
            <div
              key={column.id}
              className={`flex-shrink-0 w-72 rounded-xl border bg-card/30 backdrop-blur-sm border-t-2 ${column.color}`}
            >
              {/* Column header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{column.label}</h3>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {columnApps.length}
                  </span>
                </div>
              </div>

              {/* Column content */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] p-2 space-y-2 transition-colors ${
                      snapshot.isDraggingOver ? "bg-primary/5" : ""
                    }`}
                  >
                    {columnApps.map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-lg border bg-card hover:border-primary/50 transition-all cursor-pointer ${
                              snapshot.isDragging
                                ? "shadow-lg rotate-1 scale-105"
                                : ""
                            }`}
                            onClick={() => onSelect(app.id)}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-sm leading-tight">
                                  {app.companyName}
                                </p>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                                    {calculateApplicationScore(app)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {app.positionTitle}
                              </p>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {getPlatformLabel(app.platform)}
                                </Badge>
                                {app.priority === "HIGH" && (
                                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px] px-1.5 py-0">
                                    High Priority
                                  </Badge>
                                )}
                              </div>
                              {app.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {app.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p className="text-[10px] text-muted-foreground">
                                {formatDate(app.appliedDate)}
                              </p>
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
