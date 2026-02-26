"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Mail, Smartphone, Clock, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getUserSettings();
        if (data) setSettings(data);
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

  if (!settings) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your notification preferences
        </p>
      </div>

      {/* Reminder Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                onCheckedChange={(checked) => setSettings({ ...settings, reminderEnabled: checked })}
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
                    <p className="text-xs text-muted-foreground">Receive email reminders</p>
                  </div>
                </div>
                <Switch
                  id="email-reminders"
                  checked={settings.emailReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                    <p className="text-xs text-muted-foreground">Browser push notifications</p>
                  </div>
                </div>
                <Switch
                  id="desktop-notifications"
                  checked={settings.desktopNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, desktopNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="sms-reminders">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive SMS reminders (requires Twilio)</p>
                  </div>
                </div>
                <Switch
                  id="sms-reminders"
                  checked={settings.smsReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsReminders: checked })}
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
                    onValueChange={(v) => setSettings({ ...settings, reminderDays: parseInt(v) })}
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
                    Smart reminders adjust based on tags (Startup: 14d, MNC: 30d, Referral: 10d)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Reminder Time</Label>
                  <Select
                    value={settings.reminderTime}
                    onValueChange={(v) => setSettings({ ...settings, reminderTime: v })}
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

            <Button onClick={handleSave} disabled={isPending} className="w-full gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info card */}
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
                <p>First reminder sent after configured inactivity period</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-400">2</span>
                </div>
                <p>Second reminder sent 7 days after first reminder</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-red-400">3</span>
                </div>
                <p>After 14 more days, suggests marking as &ldquo;Likely Ghosted&rdquo;</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
