"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  LayoutGrid,
  List,
  Table2,
  Filter,
  X,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableView } from "@/components/views/table-view";
import { KanbanView } from "@/components/views/kanban-view";
import { ListView } from "@/components/views/list-view";
import { ApplicationDetail } from "@/components/applications/application-detail";
import { getApplications, exportApplications } from "@/server/actions";
import { useAppStore } from "@/hooks/use-store";
import type { Application, Interview } from "@prisma/client";
import { toast } from "sonner";

type AppWithInterviews = Application & { interviews: Interview[] };

export default function ApplicationsPage() {
  const {
    applications,
    setApplications,
    viewMode,
    setViewMode,
    statusFilter,
    setStatusFilter,
    platformFilter,
    setPlatformFilter,
    jobTypeFilter,
    setJobTypeFilter,
    searchQuery,
    setQuickAddOpen,
    selectedAppId,
    setSelectedAppId,
    clearFilters,
  } = useAppStore();

  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getApplications(false);
        setApplications(data as AppWithInterviews[]);
        setLoaded(true);
      } catch (e) {
        setLoaded(true);
      }
    });
  }, [setApplications]);

  // Filter applications
  const filtered = applications.filter((app) => {
    if (statusFilter && app.status !== statusFilter) return false;
    if (platformFilter && app.platform !== platformFilter) return false;
    if (jobTypeFilter && app.jobType !== jobTypeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        app.companyName.toLowerCase().includes(q) ||
        app.positionTitle.toLowerCase().includes(q) ||
        app.recruiterName?.toLowerCase().includes(q) ||
        app.recruiterEmail?.toLowerCase().includes(q) ||
        app.recruiterPhone?.toLowerCase().includes(q) ||
        app.location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const hasFilters = statusFilter || platformFilter || jobTypeFilter;

  const handleExport = async (format: "csv" | "json") => {
    try {
      const data = await exportApplications(format);
      const content =
        format === "json"
          ? JSON.stringify(data, null, 2)
          : convertToCSV(data as any[]);
      const blob = new Blob([content], {
        type: format === "json" ? "application/json" : "text/csv",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applications.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error("Export failed");
    }
  };

  if (!loaded) {
    return <ApplicationsSkeleton />;
  }

  const selectedApp = selectedAppId
    ? applications.find((a) => a.id === selectedAppId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} application{filtered.length !== 1 ? "s" : ""}
            {hasFilters ? " (filtered)" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            JSON
          </Button>
          <Button onClick={() => setQuickAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Filters & View toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? null : v)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="SCREENING">Screening</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
              <SelectItem value="OFFER">Offer</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="GHOSTED">Ghosted</SelectItem>
              <SelectItem value="NO_CONFIRMATION">No Confirmation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={platformFilter || "all"} onValueChange={(v) => setPlatformFilter(v === "all" ? null : v)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
              <SelectItem value="INDEED">Indeed</SelectItem>
              <SelectItem value="REFERRAL">Referral</SelectItem>
              <SelectItem value="DIRECT">Direct</SelectItem>
              <SelectItem value="GLASSDOOR">Glassdoor</SelectItem>
              <SelectItem value="COMPANY_WEBSITE">Company Website</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={jobTypeFilter || "all"} onValueChange={(v) => setJobTypeFilter(v === "all" ? null : v)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="REMOTE">Remote</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
              <SelectItem value="ONSITE">Onsite</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 h-9">
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>

        {/* View switcher */}
        <div className="flex items-center border rounded-lg p-0.5 bg-muted/50">
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-3"
            onClick={() => setViewMode("table")}
          >
            <Table2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "kanban" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-3"
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-3"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Views */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {viewMode === "table" && (
          <TableView applications={filtered} onSelect={setSelectedAppId} />
        )}
        {viewMode === "kanban" && (
          <KanbanView applications={filtered} onSelect={setSelectedAppId} />
        )}
        {viewMode === "list" && (
          <ListView applications={filtered} onSelect={setSelectedAppId} />
        )}
      </motion.div>

      {/* Application Detail Sheet */}
      {selectedApp && (
        <ApplicationDetail
          application={selectedApp}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </div>
  );
}

function convertToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]).filter(k => k !== "interviews" && k !== "attachments");
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h];
      if (Array.isArray(val)) return `"${val.join(", ")}"`;
      if (val instanceof Date) return val.toISOString();
      if (typeof val === "string" && val.includes(",")) return `"${val}"`;
      return String(val ?? "");
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function ApplicationsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-32 mt-2" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
