"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  ExternalLink,
  MoreHorizontal,
  Archive,
  Trash2,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getStatusColor,
  getStatusLabel,
  getPlatformLabel,
  getJobTypeLabel,
  formatDate,
  formatCurrency,
  calculateApplicationScore,
} from "@/lib/utils";
import { deleteApplication, archiveApplication } from "@/server/actions";
import { useAppStore } from "@/hooks/use-store";
import { toast } from "sonner";
import type { Application, Interview } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

interface TableViewProps {
  applications: AppWithInterviews[];
  onSelect: (_id: string) => void;
}

export function TableView({ applications, onSelect }: TableViewProps) {
  const { removeApplication, updateApplication } = useAppStore();

  if (applications.length === 0) {
    return <EmptyView />;
  }

  const handleDelete = async (id: string) => {
    removeApplication(id);
    try {
      await deleteApplication(id);
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleArchive = async (id: string) => {
    updateApplication(id, { archived: true });
    try {
      await archiveApplication(id, true);
      toast.success("Application archived");
    } catch {
      toast.error("Failed to archive");
    }
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Company</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Position</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Platform</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden xl:table-cell">Salary</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Score</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Applied</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, i) => (
              <motion.tr
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => onSelect(app.id)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">{app.companyName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{app.companyName}</p>
                      {app.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          {app.location}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm hidden md:table-cell">{app.positionTitle}</td>
                <td className="px-4 py-3">
                  <Badge className={getStatusColor(app.status)} variant="outline">
                    {getStatusLabel(app.status)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                  {getPlatformLabel(app.platform)}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Badge variant="outline" className="text-xs">
                    {getJobTypeLabel(app.jobType)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden xl:table-cell">
                  {app.salaryMin && app.salaryMax
                    ? `${formatCurrency(app.salaryMin)} - ${formatCurrency(app.salaryMax)}`
                    : app.salaryMax
                    ? formatCurrency(app.salaryMax)
                    : "-"}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-12 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateApplicationScore(app)}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{calculateApplicationScore(app)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                  {formatDate(app.appliedDate)}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {app.jobLink && (
                        <DropdownMenuItem asChild>
                          <a href={app.jobLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Job Link
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleArchive(app.id)}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => handleDelete(app.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyView() {
  const { setQuickAddOpen } = useAppStore();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4"
      >
        <Briefcase className="h-8 w-8 text-blue-400" />
      </motion.div>
      <h3 className="text-lg font-semibold">No applications found</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Try adjusting your filters or add a new application
      </p>
      <Button onClick={() => setQuickAddOpen(true)} className="mt-4 gap-2" variant="outline">
        <Building2 className="h-4 w-4" />
        Add Application
      </Button>
    </motion.div>
  );
}
