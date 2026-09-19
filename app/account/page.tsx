<<<<<<< HEAD
import { auth } from "@/auth";

export default async function AccountPage() {
  const session = await auth();

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Account</h1>
      <p className="text-muted-foreground">Manage your account details and billing.</p>
=======
"use client";

import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserCircle,
  ArrowLeft,
  Mail,
  ShieldCheck,
  Crown,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function AccountPage() {
  const { user, profile, sendVerification } = useAuth();

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Creator";
  const userEmail = profile?.email || user?.email || "creator@channelforge.ai";
  const isVerified = user?.emailVerified || profile?.emailVerified || false;

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
          <UserCircle className="w-7 h-7 text-primary" /> Account & Billing
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your personal credentials, plan tier, and security settings powered by Firebase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-2 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl">Profile Details</CardTitle>
            <CardDescription>Your registered identity and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary/20 shrink-0">
                <AvatarImage src={user?.photoURL || ""} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl sm:text-2xl">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="font-bold text-lg text-foreground truncate">{displayName}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 break-all">
                  <Mail className="w-3.5 h-3.5 shrink-0" /> {userEmail}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  {isVerified ? (
                    <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified Account
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-amber-600 dark:text-amber-400 border-amber-500/30">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Pending Email Verification
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {!isVerified && user && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Confirm your email to safeguard your projects.</span>
                <Button size="sm" variant="outline" onClick={() => sendVerification()}>
                  Resend Link
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Account Status</span>
                <p className="text-sm font-semibold text-foreground">Active Member</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Authentication Provider</span>
                <p className="text-sm font-semibold text-foreground capitalize">
                  {profile?.provider || "Firebase Authentication"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-muted/20">
            <span className="text-xs text-muted-foreground">Want to update your password?</span>
            <Button variant="outline" size="sm" asChild className="rounded-xl text-xs w-full sm:w-auto">
              <Link href="/forgot-password">Reset Password</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Current Plan Card */}
        <Card className="rounded-3xl flex flex-col justify-between border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subscription</span>
              <Badge className="bg-primary text-primary-foreground text-[10px]">Active</Badge>
            </div>
            <CardTitle className="text-2xl font-black pt-2 text-foreground flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" /> Free Tier
            </CardTitle>
            <CardDescription className="text-xs">
              Basic access to channel name suggestions, starter tags, and roadmaps.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pt-2">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standard Banner & Logo exports</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Up to 10 monthly AI generations</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Cloud Firestore synchronized projects</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 border-t flex flex-col gap-2">
            <Button asChild className="w-full rounded-xl text-xs font-semibold shadow-sm">
              <Link href="/pricing">
                <Crown className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Upgrade to Pro ($19/mo)
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full text-xs text-muted-foreground">
              <Link href="/pricing">Compare all features</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
    </div>
  );
}
