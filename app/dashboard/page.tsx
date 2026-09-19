<<<<<<< HEAD
import { auth } from "@/auth";
import { handleSignOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <form action={handleSignOut}>
          <Button variant="outline">Sign Out</Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>
            You are signed in securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User avatar"} />
            <AvatarFallback>{session?.user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{session?.user?.name || "Anonymous User"}</h2>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
        </CardContent>
      </Card>
=======
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { getProjectsFromFirestore } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  FolderKanban,
  UserCircle,
  Settings,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Crown,
  LogOut,
  Loader2
} from "lucide-react";
import type { FullProjectWithRelations } from "@/types";

export default function DashboardPage() {
  const { user, profile, loading, signOut, getIdToken } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<FullProjectWithRelations[]>([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        // 1. Load directly with client Firebase Web SDK Firestore
        const clientProjects = await getProjectsFromFirestore(user?.uid);
        if (isMounted && clientProjects && clientProjects.length > 0) {
          setProjects(clientProjects);
        }

        // 2. Also check API route for server synchronization
        const token = await getIdToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("/api/projects", { credentials: "include", headers });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.projects && data.projects.length > 0) {
            setProjects((prev) => {
              const map = new Map();
              data.projects.forEach((p: FullProjectWithRelations) => map.set(p.id, p));
              prev.forEach((p) => {
                if (!map.has(p.id)) map.set(p.id, p);
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch dashboard projects:", err);
      } finally {
        if (isMounted) setFetchingProjects(false);
      }
    }

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Creator";
  const userEmail = profile?.email || user?.email || "creator@channelforge.ai";
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="container mx-auto p-4 py-8 md:py-12 max-w-5xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={user?.photoURL || ""} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {displayName}
              </h1>
              <Badge variant="secondary" className="text-xs">Free Tier</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild className="rounded-xl shadow-sm">
            <Link href="/generate">
              <PlusCircle className="w-4 h-4 mr-2" /> New Channel
            </Link>
          </Button>
          <Button variant="outline" onClick={handleSignOut} className="rounded-xl">
            <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/generate"
          className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all hover:shadow-sm group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="font-semibold text-foreground text-sm flex items-center justify-between">
            <span>Creator Studio</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-muted-foreground">Generate channel names, branding, and video roadmaps.</p>
        </Link>

        <Link
          href="/projects"
          className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all hover:shadow-sm group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div className="font-semibold text-foreground text-sm flex items-center justify-between">
            <span>Your Projects</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-muted-foreground">View and download your saved brand kits and exports.</p>
        </Link>

        <Link
          href="/account"
          className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all hover:shadow-sm group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <UserCircle className="w-5 h-5" />
          </div>
          <div className="font-semibold text-foreground text-sm flex items-center justify-between">
            <span>Account & Plan</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-muted-foreground">Manage your subscription, profile details, and credits.</p>
        </Link>

        <Link
          href="/settings"
          className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all hover:shadow-sm group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <div className="font-semibold text-foreground text-sm flex items-center justify-between">
            <span>Settings</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-xs text-muted-foreground">Configure notifications, theme preferences, and export specs.</p>
        </Link>
      </div>

      {/* Upgrade Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Crown className="w-5 h-5 text-amber-500" />
            <span>Unlock Unlimited Channel Generations with Pro</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Pro creators enjoy instant high-resolution 4K banner exports, unlimited video ideas, and priority model reasoning.
          </p>
        </div>
        <Button asChild className="rounded-xl shrink-0">
          <Link href="/pricing">Upgrade Plan</Link>
        </Button>
      </div>

      {/* Recent Channels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-primary" /> Recent Channel Projects
          </h2>
          <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link href="/projects">View all projects &rarr;</Link>
          </Button>
        </div>

        {fetchingProjects ? (
          <div className="py-12 flex justify-center items-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading your Firestore projects...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map((project) => {
              const handle = project.channelNames?.[0]?.handle || `@${project.title.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
              const tags = project.keywords && project.keywords.length > 0
                ? project.keywords.slice(0, 3).map(k => `#${k.keyword.replace(/\s+/g, "")}`)
                : ["#YouTube", "#Creator", "#Branding"];

              return (
                <Card key={project.id} className="rounded-2xl flex flex-col justify-between">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[11px] font-normal truncate max-w-[140px]">
                        {project.targetNiche}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {project.isDemo ? "Demo" : new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold pt-2">{project.title}</CardTitle>
                    <CardDescription className="text-xs font-mono">{handle}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 pb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-3 border-t flex items-center justify-between">
                    <Button size="sm" variant="outline" asChild className="text-xs rounded-xl w-full">
                      <Link href={`/generate?idea=${encodeURIComponent(project.title)}`}>
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open in Studio
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
    </div>
  );
}
