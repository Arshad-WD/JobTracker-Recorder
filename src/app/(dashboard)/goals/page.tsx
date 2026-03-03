"use client";

import React, { useEffect, useState, useTransition } from "react";
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            Goals & Streaks
          </h1>
          <p className="text-muted-foreground mt-2">
            Stay on track with your job search
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Streak Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={item}>
          <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="h-7 w-7 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold">
                  {streak?.currentStreak || 0}
                  <span className="text-lg font-normal text-muted-foreground ml-1">
                    days
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="h-7 w-7 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="text-3xl font-bold">
                  {streak?.longestStreak || 0}
                  <span className="text-lg font-normal text-muted-foreground ml-1">
                    days
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                <Zap className="h-7 w-7 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-3xl font-bold">{goals.length}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* New Goal Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Create New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Apply to 10 companies this week"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.goalType}
                    onValueChange={(v) =>
                      setFormData({ ...formData, goalType: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(GOAL_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Count</Label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.targetCount}
                    onChange={(e) =>
                      setFormData({ ...formData, targetCount: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={isPending} className="gap-2">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Goal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Goals List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {goals.length === 0 ? (
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">No Goals Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Set goals to track your progress and stay motivated during your job
                search
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = Math.min(
              Math.round((goal.currentCount / goal.targetCount) * 100),
              100
            );
            const isComplete = goal.currentCount >= goal.targetCount;

            return (
              <motion.div key={goal.id} variants={item}>
                <Card className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-base">{goal.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {GOAL_TYPE_LABELS[goal.goalType] || goal.goalType}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isComplete && (
                          <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                            ✓ Complete
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {goal.currentCount} / {goal.targetCount}
                        </span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{
                            duration: 0.8,
                            ease: "easeOut",
                            delay: 0.2,
                          }}
                          className={`h-full rounded-full ${
                            isComplete
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : "bg-gradient-to-r from-violet-500 to-purple-500"
                          }`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
