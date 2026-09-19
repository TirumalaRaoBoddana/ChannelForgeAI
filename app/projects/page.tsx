<<<<<<< HEAD
import { auth } from "@/auth";

export default async function ProjectsPage() {
  const session = await auth();

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
      <p className="text-muted-foreground">Manage your generated channels and assets here.</p>
=======
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";
import { getProjectsFromFirestore, deleteProjectFromFirestore } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  PlusCircle,
  Sparkles,
  Layers,
  ArrowLeft,
  Palette,
  Loader2,
  Trash2
} from "lucide-react";
import type { FullProjectWithRelations } from "@/types";

export default function ProjectsPage() {
  const { user, getIdToken } = useAuth();
  const [projects, setProjects] = useState<FullProjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      // 1. Fetch directly using Firebase Web SDK Firestore
      const clientData = await getProjectsFromFirestore(user?.uid);
      if (clientData && clientData.length > 0) {
        setProjects(clientData);
      }

      // 2. Also check API route for server synchronization
      const token = await getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/projects", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.projects && data.projects.length > 0) {
          // Merge unique projects
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
    } catch (e) {
      console.warn("Could not load projects:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this channel project from Firestore?")) return;

    // Optimistic UI update
    setProjects((prev) => prev.filter((p) => p.id !== projectId));

    try {
      // 1. Delete directly with Firebase Web SDK
      await deleteProjectFromFirestore(projectId);

      // 2. Also call API route
      const token = await getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers,
      });
    } catch (e) {
      console.warn("Could not delete project:", e);
    }
  };

  return (
    <div className="container mx-auto p-4 py-8 md:py-12 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <FolderKanban className="w-7 h-7 text-primary" /> Your Channel Projects
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your synchronized YouTube branding architectures, Firestore records, and launch roadmaps.
          </p>
        </div>

        <Button asChild className="rounded-xl shadow-sm">
          <Link href="/generate">
            <PlusCircle className="w-4 h-4 mr-2" /> Create New Channel
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col justify-center items-center text-muted-foreground gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <span className="text-sm">Fetching projects from Cloud Firestore...</span>
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const primaryName = proj.channelNames?.find((n) => n.isPrimary) || proj.channelNames?.[0];
            const brandKit = proj.brandKit;
            const bgGradient = brandKit?.primaryColor && brandKit?.secondaryColor
              ? { background: `linear-gradient(135deg, ${brandKit.primaryColor}, ${brandKit.secondaryColor})` }
              : { background: "linear-gradient(135deg, #3B82F6, #1E3A8A)" };

            return (
              <Card key={proj.id} className="rounded-3xl flex flex-col justify-between overflow-hidden border-border/80 shadow-sm hover:border-primary/40 transition-colors">
                {/* Visual Preview Header */}
                <div
                  style={bgGradient}
                  className="h-32 flex items-center justify-between p-5 relative text-white"
                >
                  <div className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md text-white font-black flex items-center justify-center border border-white/20 text-lg shadow-sm">
                    {proj.title.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    {proj.isDemo && (
                      <Badge variant="secondary" className="bg-black/40 text-white border-white/20 text-[10px] uppercase font-bold tracking-wider">
                        Demo Project
                      </Badge>
                    )}
                    {!proj.isDemo && (
                      <button
                        onClick={(e) => handleDelete(proj.id, e)}
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-red-500/80 text-white transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-medium text-muted-foreground truncate max-w-[140px]">
                      {primaryName?.handle || `@${proj.title.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono truncate max-w-[110px]">
                      {proj.targetNiche}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold">{proj.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 pt-1 text-muted-foreground">
                    {proj.description || proj.channelProfile?.valueProposition || "Channel blueprint and brand identity kit."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 pb-4 space-y-3">
                  {/* Brand Colors row */}
                  {brandKit && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Palette className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[11px]">Palette:</span>
                      <div className="flex items-center gap-1">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: brandKit.primaryColor }} title="Primary Color" />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: brandKit.secondaryColor }} title="Secondary Color" />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: brandKit.accentColor }} title="Accent Color" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>{proj.contentIdeas?.length || 0} planned videos & concepts</span>
                  </div>

                  {/* Keywords */}
                  {proj.keywords && proj.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.keywords.slice(0, 3).map((k) => (
                        <span key={k.id} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                          #{k.keyword.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-5 pt-3 border-t bg-muted/20 flex gap-2">
                  <Button asChild size="sm" className="w-full rounded-xl text-xs">
                    <Link href={`/generate?idea=${encodeURIComponent(proj.title)}`}>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Open Studio
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty / Creation Helper */}
      <div className="p-8 rounded-3xl bg-card border border-dashed border-border/80 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-foreground text-base">Have a new channel concept?</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Describe any niche or target audience and get a tailored brand identity, SEO tags, and launch plan in seconds.
        </p>
        <Button asChild variant="outline" className="rounded-xl text-xs">
          <Link href="/generate">Launch Creator Studio</Link>
        </Button>
      </div>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
    </div>
  );
}
