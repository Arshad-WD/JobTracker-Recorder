"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getPlatformLabel,
  getJobTypeLabel,
  formatDate,
  formatCurrency,
  calculateApplicationScore,
} from "@/lib/utils";
import type { Application, Interview } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

interface ListViewProps {
  applications: AppWithInterviews[];
  onSelect: (id: string) => void;
}

export function ListView({ applications, onSelect }: ListViewProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No applications to display
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app, i) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="group p-4 rounded-xl border bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onSelect(app.id)}
        >
          <div className="flex items-start gap-4">
            {/* Company avatar */}
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold">{app.companyName.charAt(0)}</span>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{app.companyName}</h3>
                  <p className="text-sm text-muted-foreground">{app.positionTitle}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={getStatusColor(app.status)} variant="outline">
                    {getStatusLabel(app.status)}
                  </Badge>
                  <Badge className={getPriorityColor(app.priority)} variant="outline">
                    {app.priority}
                  </Badge>
                </div>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                {app.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {app.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(app.appliedDate)}
                </span>
                <span>{getPlatformLabel(app.platform)}</span>
                <Badge variant="outline" className="text-xs">{getJobTypeLabel(app.jobType)}</Badge>
                {(app.salaryMin || app.salaryMax) && (
                  <span>
                    {app.salaryMin && app.salaryMax
                      ? `${formatCurrency(app.salaryMin)} - ${formatCurrency(app.salaryMax)}`
                      : app.salaryMax
                      ? `Up to ${formatCurrency(app.salaryMax)}`
                      : ""}
                  </span>
                )}
              </div>

              {/* Tags */}
              {app.tags.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Recruiter info */}
              {(app.recruiterName || app.recruiterEmail || app.recruiterPhone) && (
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  {app.recruiterName && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {app.recruiterName}
                    </span>
                  )}
                  {app.recruiterEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {app.recruiterEmail}
                    </span>
                  )}
                  {app.recruiterPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {app.recruiterPhone}
                    </span>
                  )}
                </div>
              )}

              {/* Score & interviews */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Score:</span>
                  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${calculateApplicationScore(app)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{calculateApplicationScore(app)}</span>
                </div>
                {app.interviews.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {app.interviews.length} interview(s)
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
