"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  Clock,
  Save,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<{
    reminderEnabled: boolean;
    emailReminders: boolean;
    desktopNotifications: boolean;
    smsReminders: boolean;
    reminderDays: number;
    reminderTime: string;
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
            emailReminders: data.emailReminders,
            desktopNotifications: data.desktopNotifications,
            smsReminders: data.smsReminders,
            reminderDays: data.reminderDays,
            reminderTime: data.reminderTime,
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
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  const providerModels = aiProvider
    ? PROVIDER_MODELS[aiProvider as AIProviderType] || []
    : [];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your preferences and AI configuration
        </p>
      </div>

      {/* AI Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              AI Configuration
            </CardTitle>
            <CardDescription>
              Connect your preferred AI provider to enable smart features like
              cover letter generation, interview prep, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label className="font-medium">AI Provider</Label>
              <Select value={aiProvider} onValueChange={(v) => {
                setAiProvider(v);
                setAiModel("");
                setTestStatus("idle");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI provider..." />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(PROVIDER_LABELS) as [
                      AIProviderType,
                      string
                    ][]
                  ).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label className="font-medium">API Key</Label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono"
                  value={aiApiKey}
                  onChange={(e) => {
                    setAiApiKey(e.target.value);
                    setTestStatus("idle");
                  }}
                  placeholder="Enter your API key..."
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your key is stored securely and never shared
              </p>
            </div>

            {/* Model Selection */}
            {aiProvider && (
              <div className="space-y-2">
                <Label className="font-medium">Model</Label>
                <Select
                  value={aiModel}
                  onValueChange={setAiModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model (optional)..." />
                  </SelectTrigger>
                  <SelectContent>
                    {providerModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the default model
                </p>
              </div>
            )}

            {/* Test Connection & Save */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={!aiProvider || !aiApiKey || testStatus === "testing"}
                className="gap-2"
              >
                {testStatus === "testing" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : testStatus === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : testStatus === "error" ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                {testStatus === "testing"
                  ? "Testing..."
                  : testStatus === "success"
                  ? "Connected!"
                  : testStatus === "error"
                  ? "Failed"
                  : "Test Connection"}
              </Button>
              <Button
                onClick={handleSaveAI}
                disabled={isPending}
                className="gap-2"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save AI Settings
              </Button>
            </div>

            {testStatus === "error" && testError && (
              <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                {testError}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Reminder Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Reminder System
            </CardTitle>
            <CardDescription>
              Configure automatic follow-up reminders for your applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Master toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminder-enabled" className="font-medium">
                  Enable Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about inactive applications
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

            <Separator />

            {/* Notification channels */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notification Channels</h4>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-reminders">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive email reminders
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-reminders"
                  checked={settings.emailReminders}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailReminders: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="desktop-notifications">
                      Desktop Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Browser push notifications
                    </p>
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="sms-reminders">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive SMS reminders (requires Twilio)
                    </p>
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

            <Separator />

            {/* Timing */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Timing</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reminder After (Days)</Label>
                  <Select
                    value={String(settings.reminderDays)}
                    onValueChange={(v) =>
                      setSettings({
                        ...settings,
                        reminderDays: parseInt(v),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="15">15 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="45">45 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Smart reminders adjust based on tags (Startup: 14d, MNC:
                    30d, Referral: 10d)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Reminder Time</Label>
                  <Select
                    value={settings.reminderTime}
                    onValueChange={(v) =>
                      setSettings({ ...settings, reminderTime: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={isPending}
              className="w-full gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Escalation System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Escalation System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-amber-400">1</span>
                </div>
                <p>
                  First reminder sent after configured inactivity period
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-400">2</span>
                </div>
                <p>
                  Second reminder sent 7 days after first reminder
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-red-400">3</span>
                </div>
                <p>
                  After 14 more days, suggests marking as &ldquo;Likely
                  Ghosted&rdquo;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
