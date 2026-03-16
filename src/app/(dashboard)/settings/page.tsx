"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Smartphone,
  Clock,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserSettings, updateUserSettings } from "@/server/actions";
import { toast } from "sonner";
import {
  PROVIDER_LABELS,
  PROVIDER_MODELS,
  type AIProviderType,
} from "@/lib/ai-provider";
import { ExtensionSettings } from "@/components/dashboard/ExtensionSettings";
import MonolithButton from "@/components/neon/MonolithButton";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [settings, setSettings] = useState<{
    reminderEnabled: boolean;
    desktopNotifications: boolean;
    smsReminders: boolean;
    reminderDays: number;
    reminderTime: string;
    apiKey: string | null;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  // AI Settings
  const [aiProvider, setAiProvider] = useState<string>("");
  const [aiApiKey, setAiApiKey] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [testError, setTestError] = useState("");

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getUserSettings();
        if (data) {
          setSettings({
            reminderEnabled: data.reminderEnabled,
            desktopNotifications: data.desktopNotifications,
            smsReminders: data.smsReminders,
            reminderDays: data.reminderDays,
            reminderTime: data.reminderTime,
            apiKey: data.apiKey,
          });
          if (data.aiProvider) setAiProvider(data.aiProvider);
          if (data.aiApiKey) setAiApiKey(data.aiApiKey);
          if (data.aiModel) setAiModel(data.aiModel);
        }
      } catch {}
    });
  }, []);

  const handleSave = () => {
    if (!settings) return;
    startTransition(async () => {
      try {
        await updateUserSettings(settings);
        toast.success("Settings saved");
      } catch {
        toast.error("Failed to save settings");
      }
    });
  };

  const handleSaveAI = () => {
    startTransition(async () => {
      try {
        await updateUserSettings({
          aiProvider: aiProvider || null,
          aiApiKey: aiApiKey || null,
          aiModel: aiModel || null,
        } as Parameters<typeof updateUserSettings>[0]);
        toast.success("AI settings saved");
      } catch {
        toast.error("Failed to save AI settings");
      }
    });
  };

  const handleTestConnection = async () => {
    if (!aiProvider || !aiApiKey) {
      toast.error("Please select a provider and enter an API key");
      return;
    }

    setTestStatus("testing");
    setTestError("");

    try {
      const response = await fetch("/api/ai/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: aiProvider,
          apiKey: aiApiKey,
          model: aiModel || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTestStatus("success");
        toast.success("AI connection successful!");
      } else {
        setTestStatus("error");
        setTestError(data.error || "Connection failed");
        toast.error(data.error || "Connection failed");
      }
    } catch {
      setTestStatus("error");
      setTestError("Failed to test connection");
      toast.error("Failed to test connection");
    }

    // Reset status after 3 seconds
    setTimeout(() => setTestStatus("idle"), 3000);
  };

  if (!settings) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-9 w-36 bg-white/5" />
        <Skeleton className="h-[400px] rounded-2xl bg-white/5" />
        <Skeleton className="h-[300px] rounded-2xl bg-white/5" />
      </div>
    );
  }

  const providerModels = aiProvider
    ? PROVIDER_MODELS[aiProvider as AIProviderType] || []
    : [];

  return (
    <div className="space-y-8 max-w-2xl pb-20">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter hologram-heading text-white">Settings</h1>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em] mt-2">
          MANAGE_PREFERENCES // AI_CORE_SPECIFICATIONS
        </p>
      </div>

      {/* AI Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="border border-hologram-border bg-hologram-glass/40 backdrop-blur-xl rounded-2xl overflow-hidden relative group shadow-2xl">
          <div className="h-1.5 bg-gradient-to-r from-hologram-indigo via-hologram-cyan to-hologram-indigo" />
          <div className="absolute inset-0 bg-gradient-to-br from-hologram-indigo/5 via-transparent to-hologram-cyan/5 pointer-events-none" />
          <div className="p-8 space-y-8 relative z-10">
            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3 hologram-heading">
                <Sparkles className="h-6 w-6 text-hologram-cyan animate-pulse" />
                AI_CONFIGURATION
              </h2>
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                CONNECT_SYNAPSE_NODES // ENABLE_SMARTER_WORKFLOWS
              </p>
            </div>

            <div className="space-y-8">
              {/* Provider Selection */}
              <div className="space-y-3">
                <Label className="font-mono text-[9px] font-bold uppercase tracking-widest text-hologram-cyan/60">SYS_PROVIDER</Label>
                <Select value={aiProvider} onValueChange={(v) => {
                  setAiProvider(v);
                  setAiModel("");
                  setTestStatus("idle");
                }}>
                  <SelectTrigger className="bg-white/5 border-hologram-border/50 h-12 rounded-xl text-white font-bold uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="SELECT_PROVIDER..." />
                  </SelectTrigger>
                  <SelectContent className="bg-hologram-glass backdrop-blur-xl border border-hologram-border rounded-xl">
                    {(Object.entries(PROVIDER_LABELS) as [AIProviderType, string][]).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* API Key */}
              <div className="space-y-3">
                <Label className="font-mono text-[9px] font-bold uppercase tracking-widest text-hologram-cyan/60">ACCESS_UPLINK_KEY</Label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    className="w-full bg-white/5 border border-hologram-border/50 h-12 rounded-xl px-4 pr-12 text-white font-mono text-xs focus:ring-2 focus:ring-hologram-cyan/20 focus:border-hologram-cyan/50 outline-none transition-all"
                    value={aiApiKey}
                    onChange={(e) => {
                      setAiApiKey(e.target.value);
                      setTestStatus("idle");
                    }}
                    placeholder="ENTER_ENCRYPTED_KEY..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-hologram-cyan transition-colors"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Model Selection */}
              {aiProvider && (
                <div className="space-y-3">
                  <Label className="font-mono text-[9px] font-bold uppercase tracking-widest text-hologram-cyan/60">CORE_MODEL</Label>
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger className="bg-white/5 border-hologram-border/50 h-12 rounded-xl text-white font-bold uppercase tracking-widest text-[10px]">
                      <SelectValue placeholder="AUTO_SELECT_OPTIMAL..." />
                    </SelectTrigger>
                    <SelectContent className="bg-hologram-glass backdrop-blur-xl border border-hologram-border rounded-xl">
                      {providerModels.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Test Connection & Save */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleTestConnection}
                  disabled={!aiProvider || !aiApiKey || testStatus === "testing"}
                  className={cn(
                    "flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all border",
                    testStatus === "success" 
                      ? "bg-green-500/10 border-green-500/50 text-green-400" 
                      : testStatus === "error"
                      ? "bg-red-500/10 border-red-500/50 text-red-400"
                      : "bg-white/5 border-hologram-border/50 text-white/60 hover:bg-white/10 hover:border-hologram-cyan/50"
                  )}
                >
                  {testStatus === "testing" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-hologram-cyan" />
                  ) : testStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : testStatus === "error" ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {testStatus === "testing"
                    ? "SYSTEM_CHECK..."
                    : testStatus === "success"
                    ? "LINK_ESTABLISHED"
                    : testStatus === "error"
                    ? "SYNC_FAILED"
                    : "TEST_UPLINK"}
                </button>
                <MonolithButton
                  onClick={handleSaveAI}
                  disabled={isPending}
                  className="flex-1 h-12"
                >
                  COMMIT_CONFIG
                </MonolithButton>
              </div>

              {testStatus === "error" && testError && (
                <div className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 uppercase tracking-widest">
                  [ERROR]: {testError}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Extension Settings */}
      <ExtensionSettings initialApiKey={settings.apiKey} />

      {/* Reminder Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="border border-hologram-border bg-hologram-glass/40 backdrop-blur-xl rounded-2xl p-8 space-y-8 relative overflow-hidden group shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-br from-hologram-cyan/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="space-y-2 relative z-10">
              <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3 hologram-heading">
                <Bell className="h-6 w-6 text-hologram-indigo" />
                REMINDER_SYSTEM
              </h2>
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                CONFIGURE_AUTO_FOLLOW_UP_PROTOCOL
              </p>
           </div>

           <div className="space-y-6 relative z-10">
            {/* Master toggle */}
            <div className="flex items-center justify-between p-6 bg-white/5 border border-hologram-border/50 rounded-2xl">
              <div>
                <Label htmlFor="reminder-enabled" className="font-mono text-[11px] font-bold uppercase tracking-widest text-white">
                  ENABLE_REMINDERS
                </Label>
                <p className="font-mono text-[10px] text-white/40 uppercase mt-1">
                  NOTIFY_ON_INACTIVE_UNITS
                </p>
              </div>
              <Switch
                id="reminder-enabled"
                checked={settings.reminderEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, reminderEnabled: checked })
                }
              />
            </div>

            <Separator className="bg-hologram-border/30" />

            {/* Notification channels */}
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] font-bold text-hologram-indigo uppercase tracking-[0.2em]">NOTIFICATION_CHANNELS</h4>

              <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 border border-hologram-border/50 flex items-center justify-center rounded-xl bg-white/5">
                    <Bell className="h-4 w-4 text-hologram-cyan/60" />
                  </div>
                  <div>
                    <Label htmlFor="desktop-notifications" className="font-bold text-[11px] uppercase tracking-wider text-white">
                      DESKTOP_PUSH
                    </Label>
                    <p className="font-mono text-[8px] text-white/40 uppercase">BROWSER_NODE_NOTIFICATION</p>
                  </div>
                </div>
                <Switch
                  id="desktop-notifications"
                  checked={settings.desktopNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      desktopNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 border border-hologram-border/50 flex items-center justify-center rounded-xl bg-white/5">
                    <Smartphone className="h-4 w-4 text-hologram-cyan/60" />
                  </div>
                  <div>
                    <Label htmlFor="sms-reminders" className="font-bold text-[11px] uppercase tracking-wider text-white">SMS_COMMS</Label>
                    <p className="font-mono text-[8px] text-white/40 uppercase">REMOTE_DEVICE_UPLINK</p>
                  </div>
                </div>
                <Switch
                  id="sms-reminders"
                  checked={settings.smsReminders}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, smsReminders: checked })
                  }
                />
              </div>
            </div>

            <Separator className="bg-hologram-border/30" />

            {/* Timing */}
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] font-bold text-hologram-indigo uppercase tracking-[0.2em]">TIMING_WINDOW</h4>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="font-mono text-[9px] uppercase text-white/40">DORMANCY_LIMIT (DAYS)</Label>
                  <Select
                    value={String(settings.reminderDays)}
                    onValueChange={(v) =>
                      setSettings({
                        ...settings,
                        reminderDays: parseInt(v),
                      })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-hologram-border/50 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-hologram-glass backdrop-blur-xl border border-hologram-border rounded-xl">
                      <SelectItem value="7">07D_CYCLE</SelectItem>
                      <SelectItem value="14">14D_CYCLE</SelectItem>
                      <SelectItem value="15">15D_CYCLE</SelectItem>
                      <SelectItem value="30">30D_CYCLE</SelectItem>
                      <SelectItem value="45">45D_CYCLE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="font-mono text-[9px] uppercase text-white/40">SYNC_TIME</Label>
                  <Select
                    value={settings.reminderTime}
                    onValueChange={(v) =>
                      setSettings({ ...settings, reminderTime: v })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-hologram-border/50 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-hologram-glass backdrop-blur-xl border border-hologram-border rounded-xl">
                      <SelectItem value="08:00">08:00_HRS</SelectItem>
                      <SelectItem value="09:00">09:00_HRS</SelectItem>
                      <SelectItem value="10:00">10:00_HRS</SelectItem>
                      <SelectItem value="12:00">12:00_HRS</SelectItem>
                      <SelectItem value="18:00">18:00_HRS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <MonolithButton
              onClick={handleSave}
              disabled={isPending}
              className="w-full py-4 text-lg"
            >
              SAVE_RECALL_CONFIG
            </MonolithButton>
          </div>
        </div>
      </motion.div>

      {/* Escalation System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-8 space-y-6 relative overflow-hidden group shadow-xl">
           <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
           <div className="space-y-2 relative z-10">
              <h2 className="text-xl font-black uppercase tracking-tight text-amber-500 flex items-center gap-3">
                 <Clock className="h-6 w-6" />
                 ESCALATION_SYSTEM
              </h2>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex items-start gap-4 p-4 bg-white/5 border border-amber-500/10 rounded-xl">
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-amber-500 font-mono">01</span>
                </div>
                <p className="font-mono text-[11px] text-white/50 uppercase leading-relaxed pt-1">
                  FIRST_REMINDER_TRIGGERED_AFTER_DORMANCY_PERIOD
                </p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 border border-orange-500/10 rounded-xl">
                <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-orange-500 font-mono">02</span>
                </div>
                <p className="font-mono text-[11px] text-white/50 uppercase leading-relaxed pt-1">
                  SECOND_REMINDER_TRIGGERED_T_PLUS_07D
                </p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 border border-red-500/10 rounded-xl">
                <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-red-500 font-mono">03</span>
                </div>
                <p className="font-mono text-[11px] text-white/50 uppercase leading-relaxed pt-1">
                  T_PLUS_14D_CRITICAL: SUGGEST_GHOSTED_STATUS_OVERRIDE
                </p>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
