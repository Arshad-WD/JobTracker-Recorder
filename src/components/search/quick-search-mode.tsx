"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Search, X, Building2, Briefcase, User, Mail, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { searchApplications } from "@/server/actions";
import { useAppStore } from "@/hooks/use-store";
import type { Application, Interview } from "@prisma/client";

type AppWithInterviews = Application & { interviews: Interview[] };

export function QuickSearchMode() {
  const { isQuickSearchOpen, setQuickSearchOpen } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AppWithInterviews[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isQuickSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isQuickSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      startTransition(async () => {
        try {
          const data = await searchApplications(query);
          setResults(data as AppWithInterviews[]);
        } catch {
          setResults([]);
        }
      });
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickSearchOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [setQuickSearchOpen]);

  return (
    <AnimatePresence>
      {isQuickSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center"
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setQuickSearchOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-16 mb-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-4">
              <PhoneCall className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">Incoming Call Mode</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Quick Search
            </h1>
            <p className="text-muted-foreground mt-1">
              Type recruiter name, company, or phone number
            </p>
          </motion.div>

          {/* Search input */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl px-4"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full h-16 pl-14 pr-6 text-xl rounded-2xl border-2 border-border bg-card focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </motion.div>

          {/* Results */}
          <div className="w-full max-w-2xl px-4 mt-6 flex-1 overflow-y-auto pb-8">
            {isPending && (
              <div className="text-center text-muted-foreground py-8">
                <div className="inline-block h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            )}

            {!isPending && query && results.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                No matches found
              </motion.p>
            )}

            <div className="space-y-3">
              {results.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl border bg-card hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">{app.companyName}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span className="text-sm">{app.positionTitle}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {app.recruiterName && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span>{app.recruiterName}</span>
                      </div>
                    )}
                    {app.recruiterEmail && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{app.recruiterEmail}</span>
                      </div>
                    )}
                    {app.recruiterPhone && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{app.recruiterPhone}</span>
                      </div>
                    )}
                    <div className="text-muted-foreground">
                      Applied: {formatDate(app.appliedDate)}
                    </div>
                  </div>

                  {app.interviews.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        {app.interviews.length} interview round(s) — Latest: Round {app.interviews[app.interviews.length - 1].roundNumber}
                      </p>
                    </div>
                  )}

                  {app.notes && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 bg-muted/50 rounded-lg p-2">
                      {app.notes}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
