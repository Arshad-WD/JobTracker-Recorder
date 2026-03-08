"use client";

import React, { useEffect, useState, useTransition } from "react";
import MonolithButton from "@/components/neon/MonolithButton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Target,
  Plus,
  Trash2,
  Flame,
  Trophy,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getGoals,
  createGoal,
  deleteGoal,
  getStreakData,
} from "@/server/goals-actions";
import { toast } from "sonner";

// Inline type until Prisma client is regenerated with Goal model
interface Goal {
  id: string;
  title: string;
  goalType: string;
  targetCount: number;
  currentCount: number;
  isActive: boolean;
  createdAt: Date;
  endDate: Date | null;
}

const GOAL_TYPE_LABELS: Record<string, string> = {
  WEEKLY_APPLICATIONS: "Weekly Applications",
  WEEKLY_INTERVIEWS: "Weekly Interviews",
  MONTHLY_APPLICATIONS: "Monthly Applications",
  MONTHLY_INTERVIEWS: "Monthly Interviews",
  CUSTOM: "Custom Goal",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [streak, setStreak] = useState<{
    currentStreak: number;
    longestStreak: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    goalType: "WEEKLY_APPLICATIONS",
    targetCount: "5",
  });

  useEffect(() => {
    startTransition(async () => {
      try {
        const [goalsData, streakData] = await Promise.all([
          getGoals(),
          getStreakData(),
        ]);
        setGoals(goalsData);
        if (streakData) setStreak(streakData);
        setLoaded(true);
      } catch {
        setLoaded(true);
      }
    });
  }, []);

  const handleCreate = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a goal title");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createGoal({
          title: formData.title,
          goalType: formData.goalType,
          targetCount: parseInt(formData.targetCount) || 5,
        });

        if (result.success && result.data) {
          setGoals((prev) => [result.data, ...prev]);
          setFormData({
            title: "",
            goalType: "WEEKLY_APPLICATIONS",
            targetCount: "5",
          });
          setShowForm(false);
          toast.success("Goal created!");
        }
      } catch {
        toast.error("Failed to create goal");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteGoal(id);
        setGoals((prev) => prev.filter((g) => g.id !== id));
        toast.success("Goal deleted");
      } catch {
        toast.error("Failed to delete goal");
      }
    });
  };

  if (!loaded) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-36" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-[300px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-[3px] border-white pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
            PERSISTENCE_DRIVE
          </h1>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-4">
            GOALS_AND_STREAK_MONITORING // STATUS: ACTIVE
          </p>
        </div>
        <MonolithButton
          onClick={() => setShowForm(!showForm)}
          variant="black"
          className="md:w-auto"
        >
          {showForm ? "ABORT_ENTRY" : "INITIALIZE_NEW_GOAL"}
        </MonolithButton>
      </div>

      {/* Streak Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StreakBlock
          icon={Flame}
          label="CURRENT_STREAK"
          value={streak?.currentStreak || 0}
          unit="DAYS"
          color="#F97316"
        />
        <StreakBlock
          icon={Trophy}
          label="PEAK_RECORD"
          value={streak?.longestStreak || 0}
          unit="DAYS"
          color="#FBBF24"
        />
        <StreakBlock
          icon={Zap}
          label="ACTIVE_NODES"
          value={goals.length}
          unit="UNITS"
          color="#8B5CF6"
        />
      </motion.div>

      {/* New Goal Form */}
      {showForm && (
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
        >
          <div className="border-[3px] border-white bg-black p-8 relative overflow-hidden">
             <div className="monolith-scanlines" />
             <div className="relative z-10 space-y-6">
                <h2 className="text-xl font-black uppercase tracking-widest text-white border-b border-white/10 pb-4">
                   NEW_GOAL_CONFIGURATION
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] font-black uppercase tracking-widest text-white/40">GOAL_IDENTIFIER</Label>
                    <input
                      className="w-full bg-black border-[2px] border-white/20 p-4 font-mono text-sm text-white outline-none focus:border-[#8B5CF6] transition-colors rounded-none"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="ENTER_OBJECTIVE_DESCRIPTION..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-mono text-[10px] font-black uppercase tracking-widest text-white/40">LOGIC_TYPE</Label>
                      <Select
                        value={formData.goalType}
                        onValueChange={(v) =>
                          setFormData({ ...formData, goalType: v })
                        }
                      >
                        <SelectTrigger className="bg-black border-[2px] border-white/20 h-14 rounded-none font-mono text-xs uppercase">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-[2px] border-white rounded-none">
                          {Object.entries(GOAL_TYPE_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key} className="font-mono text-xs uppercase hover:bg-white hover:text-black rounded-none">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-mono text-[10px] font-black uppercase tracking-widest text-white/40">TARGET_THRESHOLD</Label>
                      <input
                        type="number"
                        min="1"
                        className="w-full bg-black border-[2px] border-white/20 p-4 h-[56px] font-mono text-sm text-white outline-none focus:border-[#8B5CF6] transition-colors rounded-none"
                        value={formData.targetCount}
                        onChange={(e) =>
                          setFormData({ ...formData, targetCount: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <MonolithButton onClick={handleCreate} disabled={isPending} glitch className="flex-1">
                    {isPending ? "UPLOADING..." : "COMMIT_OBJECTIVE"}
                  </MonolithButton>
                  <MonolithButton
                    variant="black"
                    onClick={() => setShowForm(false)}
                  >
                    CANCEL
                  </MonolithButton>
                </div>
             </div>
          </div>
        </motion.div>
      )}

      {/* Goals List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {goals.length === 0 ? (
          <div className="border-[3px] border-white/10 bg-black p-20 flex flex-col items-center justify-center text-center space-y-6">
             <div className="h-24 w-24 border-[3px] border-white/10 flex items-center justify-center">
                <Target className="h-10 w-10 text-white/20" />
             </div>
             <div>
                <h3 className="text-xl font-black uppercase tracking-widest">NO_OBJECTIVES_DETECTED</h3>
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-2">
                  SYSTEM AI AWAITS DIRECTIVES // INITIALIZE FIRST GOAL
                </p>
             </div>
             {!showForm && (
               <MonolithButton onClick={() => setShowForm(true)} glitch>
                  BOOT_FIRST_GOAL
               </MonolithButton>
             )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {goals.map((goal) => {
              const progress = Math.min(
                Math.round((goal.currentCount / goal.targetCount) * 100),
                100
              );
              const isComplete = goal.currentCount >= goal.targetCount;

              return (
                <motion.div key={goal.id} variants={item}>
                  <div className="border-[3px] border-white bg-black p-8 group hover:border-[#8B5CF6] transition-all relative overflow-hidden">
                    <div className="monolith-scanlines rounded-none" />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <div className={cn(
                               "w-2 h-2 rounded-none",
                               isComplete ? "bg-[#22C55E] shadow-[0_0_8px_#22C55E]" : "bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]"
                             )} />
                             <h3 className="text-2xl font-black uppercase tracking-tight text-white">{goal.title}</h3>
                          </div>
                          <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                             TYPE: {GOAL_TYPE_LABELS[goal.goalType] || goal.goalType} // ID: {goal.id.slice(0, 8)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {isComplete && (
                            <span className="font-mono text-[10px] font-black text-[#22C55E] border-[2px] border-[#22C55E] px-4 py-1 uppercase tracking-widest bg-[#22C55E]/5 backdrop-blur-sm">
                              GOAL_REACHED
                            </span>
                          )}
                          <button
                            className="h-10 w-10 border-[2px] border-white/20 flex items-center justify-center hover:bg-[#EF4444] hover:border-[#EF4444] transition-all text-white/40 hover:text-white"
                            onClick={() => handleDelete(goal.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-end justify-between font-mono">
                          <div className="space-y-1">
                             <p className="text-[8px] text-white/20 uppercase tracking-[0.4em]">CURRENT_PERFORMANCE</p>
                             <p className="text-xl font-black text-white">
                                {goal.currentCount} <span className="text-xs text-white/20">OUT_OF</span> {goal.targetCount}
                             </p>
                          </div>
                          <div className="text-right space-y-1">
                             <p className="text-[8px] text-white/20 uppercase tracking-[0.4em]">DRIVE_PERCENT</p>
                             <p className={cn(
                               "text-xl font-black",
                               isComplete ? "text-[#22C55E]" : "text-[#8B5CF6]"
                             )}>{progress}%</p>
                          </div>
                        </div>

                        <div className="h-4 w-full border-[2px] border-white/20 bg-black overflow-hidden p-0.5 relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={cn(
                              "h-full relative z-10",
                              isComplete ? "bg-[#22C55E] shadow-[0_0_15px_#22C55E]" : "bg-[#8B5CF6] shadow-[0_0_15px_#8B5CF6]"
                            )}
                          />
                          <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" 
                             style={{ backgroundSize: '4px 4px', backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StreakBlock({ icon: Icon, label, value, unit, color }: any) {
  return (
    <motion.div variants={item} className="group">
       <div className="border-[3px] border-white bg-black p-8 relative overflow-hidden hover:border-white transition-all">
          <div className="monolith-scanlines" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 -mr-8 -mt-8 rotate-45 group-hover:bg-white/10 transition-all" />
          
          <div className="relative z-10 flex items-center gap-6">
             <div className="h-16 w-16 border-[3px] border-white bg-black flex items-center justify-center" style={{ boxShadow: `6px 6px 0px ${color}` }}>
                <Icon className="h-7 w-7" style={{ color }} />
             </div>
             <div>
                <p className="font-mono text-[8px] text-white/40 uppercase tracking-[0.4em] mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-4xl font-black tracking-tighter text-white">{value}</p>
                   <p className="font-mono text-[10px] font-black uppercase text-white/20">{unit}</p>
                </div>
             </div>
          </div>
       </div>
    </motion.div>
  );
}
