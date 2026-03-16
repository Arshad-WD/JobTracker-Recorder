"use client";

import React, { useState, useTransition } from "react";
import { 
  Chrome, 
  Copy, 
  Trash2, 
  RefreshCw, 
  Check, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateExtensionApiKey, deleteExtensionApiKey } from "@/server/actions";
import { motion } from "framer-motion";

interface ExtensionSettingsProps {
  initialApiKey: string | null;
}

export function ExtensionSettings({ initialApiKey }: ExtensionSettingsProps) {
  const [apiKey, setApiKey] = useState<string | null>(initialApiKey);
  const [isRefreshing, startRefreshing] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    startRefreshing(async () => {
      try {
        const result = await generateExtensionApiKey();
        if (result.success && result.apiKey) {
          setApiKey(result.apiKey);
          toast.success("New API Key generated");
        }
      } catch (error) {
        toast.error("Failed to generate API Key");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete your API Key? The Chrome extension will stop working.")) {
      return;
    }
    startDeleting(async () => {
      try {
        const result = await deleteExtensionApiKey();
        if (result.success) {
          setApiKey(null);
          toast.success("API Key deleted");
        }
      } catch (error) {
        toast.error("Failed to delete API Key");
      }
    });
  };

  const copyToClipboard = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" />
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Chrome className="h-5 w-5 text-blue-400" />
            Chrome Extension
          </CardTitle>
          <CardDescription>
            Connect the JobTracker Chrome extension to capture jobs directly from your browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!apiKey ? (
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/20">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                <Chrome className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-medium text-sm mb-1">No API Key Generated</h3>
              <p className="text-xs text-muted-foreground text-center mb-4 max-w-[250px]">
                You need an API Key to authorize the Chrome extension to sync jobs to your account.
              </p>
              <Button 
                onClick={handleGenerate} 
                disabled={isRefreshing}
                size="sm"
                className="gap-2"
              >
                {isRefreshing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                Generate API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your API Key</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono text-sm bg-background border border-input px-3 py-2 rounded-lg truncate select-all">
                    {apiKey}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-shrink-0 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500"
                  >
                    {isDeleting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-blue-500/5 border border-blue-500/10 p-3 space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">How to setup</span>
                </div>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open <code className="bg-muted px-1 rounded">chrome://extensions</code> in your browser</li>
                  <li>Enable <strong>Developer mode</strong> (top right)</li>
                  <li>Click <strong>Load unpacked</strong> and select the <code className="bg-muted px-1 rounded">extension</code> folder</li>
                  <li>Click the extension icon and enter your API Key and Server URL</li>
                </ol>
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGenerate}
                  disabled={isRefreshing}
                  className="text-xs gap-1.5 h-auto py-1.5 px-2 hover:bg-blue-500/5 hover:text-blue-400"
                >
                  <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Regenerate Key
                </Button>
                
                <a 
                  href="/jobtracker-extension.zip" 
                  download
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  Download .zip <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
