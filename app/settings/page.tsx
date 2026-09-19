<<<<<<< HEAD
import { auth } from "@/auth";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">Manage your app preferences and settings.</p>
=======
"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  ArrowLeft,
  Moon,
  Sun,
  Laptop,
  Bell,
  Sparkles,
  Check,
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [highResExports, setHighResExports] = useState(true);
  const [autoTagOptimization, setAutoTagOptimization] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="container mx-auto p-4 py-8 md:py-12 max-w-4xl space-y-8">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b">
        <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground mb-2">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-primary" /> App Preferences & Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Customize your creator studio workspace, theme, and export parameters.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Card */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Appearance & Theme</CardTitle>
            <CardDescription>Select how ChannelForge AI looks on your device.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border/80 hover:border-border text-muted-foreground"
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-xs">Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border/80 hover:border-border text-muted-foreground"
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-xs">Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  theme === "system"
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border/80 hover:border-border text-muted-foreground"
                }`}
              >
                <Laptop className="w-5 h-5" />
                <span className="text-xs">System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Generator Preferences */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Generator & Export Defaults</CardTitle>
            <CardDescription>Configure default options applied to each new channel generation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between gap-4 pb-4 border-b">
              <div className="space-y-0.5">
                <Label htmlFor="highres" className="text-sm font-semibold text-foreground">
                  SVG Vector Generation
                </Label>
                <p className="text-xs text-muted-foreground">
                  Produce scalable vector graphic specifications for channel logos and banner artwork.
                </p>
              </div>
              <Switch
                id="highres"
                checked={highResExports}
                onCheckedChange={setHighResExports}
              />
            </div>

            <div className="flex items-center justify-between gap-4 pb-4 border-b">
              <div className="space-y-0.5">
                <Label htmlFor="autotags" className="text-sm font-semibold text-foreground">
                  YouTube SEO Tag Optimization
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically format generated hashtags and search tags with high-traffic algorithmic keywords.
                </p>
              </div>
              <Switch
                id="autotags"
                checked={autoTagOptimization}
                onCheckedChange={setAutoTagOptimization}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-sm font-semibold text-foreground">
                  Product Updates & Creator Tips
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive weekly channel growth tactics, algorithmic strategy alerts, and new feature announcements.
                </p>
              </div>
              <Switch
                id="notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20">
            {saved ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Preferences saved successfully!
              </span>
            ) : (
              <span className="text-xs text-muted-foreground text-center sm:text-left">Changes take effect across your sessions.</span>
            )}
            <Button onClick={handleSave} className="rounded-xl text-xs font-semibold px-6 shadow-sm w-full sm:w-auto min-h-[40px]">
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
    </div>
  );
}
