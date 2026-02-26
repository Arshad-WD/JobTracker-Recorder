"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Archive, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getStatusColor,
  getStatusLabel,
  getPlatformLabel,
  formatDate,
} from "@/lib/utils";
import { getApplications, archiveApplication, deleteApplication } from "@/server/actions";
import { toast } from "sonner";
import type { Application, Interview } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

export default function ArchivedPage() {
  const [apps, setApps] = useState<AppWithInterviews[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getApplications(true);
        setApps(data as AppWithInterviews[]);
        setLoaded(true);
      } catch {
        setLoaded(true);
      }
    });
  }, []);

  const handleUnarchive = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    startTransition(async () => {
      try {
        await archiveApplication(id, false);
        toast.success("Application restored");
      } catch {
        toast.error("Failed to restore");
      }
    });
  };

  const handleDelete = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    startTransition(async () => {
      try {
        await deleteApplication(id);
        toast.success("Application permanently deleted");
      } catch {
        toast.error("Failed to delete");
      }
    });
  };

  if (!loaded) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-36" />
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Archived</h1>
        <p className="text-muted-foreground mt-1">
          {apps.length} archived application{apps.length !== 1 ? "s" : ""}
        </p>
      </div>

      {apps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4"
          >
            <Archive className="h-8 w-8 text-muted-foreground" />
          </motion.div>
          <h3 className="text-lg font-semibold">No archived applications</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Archived applications will appear here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {apps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between p-4 rounded-xl border bg-card/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">
                    {app.companyName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{app.companyName}</p>
                  <p className="text-sm text-muted-foreground">{app.positionTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(app.status)} variant="outline">
                  {getStatusLabel(app.status)}
                </Badge>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {formatDate(app.appliedDate)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleUnarchive(app.id)}
                >
                  <RotateCcw className="h-3 w-3" />
                  Restore
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-500"
                  onClick={() => handleDelete(app.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
