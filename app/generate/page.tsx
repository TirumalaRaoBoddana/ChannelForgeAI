"use client";

import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/custom/page-header";
import { GenerationCard } from "@/components/custom/generation-card";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function GenerateWorkflow() {
  const searchParams = useSearchParams();
  const idea = searchParams.get("idea") || "A new YouTube channel...";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-4 text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <PageHeader 
          title="Generating Your Channel..." 
          description="Our AI is crafting your complete brand identity. This will take just a moment." 
        />
      </div>
      <div className="mt-8 space-y-6">
         <GenerationCard 
           status="generating" 
           prompt={idea} 
           progress={25} 
         />
=======
import { AssetCard } from "@/components/custom/asset-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Download,
  Copy,
  Check,
  Target,
  Palette,
  Video,
  Layers,
  RefreshCw,
  Hash,
  ExternalLink,
  CloudUpload,
  CheckCircle2,
  Loader2,
  BookmarkCheck
} from "lucide-react";
import { Suspense, useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { saveProjectToFirestore, saveAssetToFirestore } from "@/lib/firebase/firestore";
import { uploadAssetFile } from "@/lib/firebase/storage";

function deriveChannelData(promptText: string) {
  const clean = promptText.trim();
  const lower = clean.toLowerCase();

  let name = "VisionCraft";
  let handle = "@VisionCraft";
  let tagline = "Turning creative ideas into high-impact digital experiences.";
  let bannerGradient = "from-indigo-950 via-slate-900 to-indigo-900";
  let logoSymbol = "VC";
  let logoGradient = "from-indigo-400 to-cyan-400";
  let tags = ["#DigitalCreator", "#ContentStrategy", "#YouTubeGrowth", "#OnlineBrand", "#CreativeProcess"];
  let videos = [
    { title: "How I Built a Cohesive Channel Brand in 48 Hours", type: "Pillar Video", duration: "12:45", views: "High Growth Potential" },
    { title: "3 Mistakes That Kill New Channels Before They Start #Shorts", type: "Viral Short", duration: "0:52", views: "Algorithm Pick" },
    { title: "The Exact Gear & Tools I Use for Effortless Recording", type: "Setup & Gear", duration: "15:20", views: "High Conversion" },
    { title: "From 0 to 10k Subscribers: The Honest Content Blueprint", type: "Case Study", duration: "18:10", views: "Evergreen Search" }
  ];

  if (lower.includes("math") || lower.includes("ai") || lower.includes("machine learning")) {
    name = "The Math of AI";
    handle = "@MathOfAI";
    tagline = "Intuitive mathematics, linear algebra, and calculus behind modern artificial intelligence and deep neural networks.";
    bannerGradient = "from-indigo-950 via-slate-900 to-violet-950";
    logoSymbol = "∑";
    logoGradient = "from-indigo-400 to-cyan-400";
    tags = ["#MathOfAI", "#MachineLearning", "#NeuralNetworks", "#LinearAlgebra", "#DataScience", "#DeepLearning"];
    videos = [
      { title: "Linear Algebra for Deep Learning: The Missing Intuition", type: "Pillar Video", duration: "16:40", views: "High Retention" },
      { title: "Backpropagation Explained in 60 Seconds #Shorts", type: "Viral Short", duration: "0:58", views: "High Velocity" },
      { title: "How Transformers Actually Process Attention Matrices", type: "Visual Breakdown", duration: "21:15", views: "Evergreen Search" },
      { title: "The Calculus Behind Gradient Descent (Visualized Step-by-Step)", type: "Core Guide", duration: "14:50", views: "High Audience Share" }
    ];
  } else if (lower.includes("cook") || lower.includes("food") || lower.includes("student") || lower.includes("chef")) {
    name = "15-Minute Dorm Chef";
    handle = "@DormChef";
    tagline = "Delicious, budget-friendly one-pan meals designed for college students and busy young professionals.";
    bannerGradient = "from-emerald-950 via-stone-900 to-teal-950";
    logoSymbol = "🍳";
    logoGradient = "from-emerald-400 to-teal-300";
    tags = ["#StudentCooking", "#BudgetMeals", "#15MinuteRecipes", "#EasyDinner", "#CollegeHacks", "#MealPrep"];
    videos = [
      { title: "5 Gourmet Dinners Under $3 (Using Dorm Essentials)", type: "Pillar Video", duration: "13:20", views: "High Share Rate" },
      { title: "Crispy Egg Hack That Changed My Breakfast #Shorts", type: "Viral Short", duration: "0:44", views: "Trending Format" },
      { title: "One-Pan Garlic Butter Pasta in Exactly 12 Minutes", type: "Fast Recipe", duration: "09:30", views: "High Repeat Views" },
      { title: "Weekly Grocery Haul on a $25 Budget (Full Meal Plan)", type: "Budget Guide", duration: "17:05", views: "High Evergreen Demand" }
    ];
  } else if (lower.includes("game") || lower.includes("gaming") || lower.includes("cozy") || lower.includes("play")) {
    name = "Cozy Realm Gaming";
    handle = "@CozyRealm";
    tagline = "Relaxing, atmospheric playthroughs and calm gaming aesthetics with zero commentary and ambient soundscapes.";
    bannerGradient = "from-purple-950 via-slate-900 to-pink-950";
    logoSymbol = "🎮";
    logoGradient = "from-pink-400 to-purple-300";
    tags = ["#CozyGaming", "#NoCommentary", "#RelaxingGames", "#AestheticPlaythrough", "#IndieGames", "#LofiGaming"];
    videos = [
      { title: "Rainy Night in Stardew Valley &bull; 1 Hour Calm Playthrough", type: "Ambient Long-form", duration: "58:00", views: "High Watch Time" },
      { title: "The Most Relaxing Indie Game You Never Played #Shorts", type: "Viral Short", duration: "0:49", views: "Discovery Booster" },
      { title: "Top 7 Cozy Games Releasing This Month to De-Stress", type: "Curated Showcase", duration: "11:15", views: "Search Magnet" },
      { title: "Calm Forest Exploration & Chill Lo-Fi Soundtrack", type: "Atmospheric", duration: "42:30", views: "High Retention" }
    ];
  } else if (clean.length > 0) {
    // Generate derived title from words
    const words = clean.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/).slice(0, 3);
    const capitalized = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    name = capitalized ? `${capitalized} Channel` : "Creator Channel";
    handle = `@${name.replace(/\s+/g, "")}`;
    tagline = `The ultimate guide and strategic blueprint for ${clean}.`;
    logoSymbol = words[0] ? words[0].charAt(0).toUpperCase() : "★";
    tags = [`#${name.replace(/\s+/g, "")}`, "#YouTubeStrategy", "#CreatorEconomy", "#TrendingVideos", "#VideoIdeas"];
  }

  return { name, handle, tagline, bannerGradient, logoSymbol, logoGradient, tags, videos };
}

function GenerateWorkflow() {
  const searchParams = useSearchParams();
  const rawIdea = searchParams.get("idea");
  const idea = rawIdea ? decodeURIComponent(rawIdea) : "The Math of AI";

  const { user, getIdToken } = useAuth();
  const [progress, setProgress] = useState(15);
  const [status, setStatus] = useState<"generating" | "completed">("generating");
  const [stageText, setStageText] = useState("Analyzing YouTube niche & competitor whitespace...");
  const [copiedTag, setCopiedTag] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const channelData = useMemo(() => deriveChannelData(idea), [idea]);

  useEffect(() => {
    // Reset state on prompt change
    setProgress(15);
    setStatus("generating");
    setStageText("Analyzing YouTube niche & competitor whitespace...");

    const t1 = setTimeout(() => {
      setProgress(45);
      setStageText("Synthesizing channel name & high-impact SEO tags...");
    }, 600);

    const t2 = setTimeout(() => {
      setProgress(80);
      setStageText("Designing YouTube banner & 4K vector logo mark...");
    }, 1200);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStageText("Finalizing content roadmap & kit bundle...");
    }, 1800);

    const t4 = setTimeout(() => {
      setStatus("completed");
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [idea]);

  const handleCopyTags = () => {
    navigator.clipboard.writeText(channelData.tags.join(" "));
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const handleDownloadKit = () => {
    const kitData = {
      channel: channelData.name,
      handle: channelData.handle,
      tagline: channelData.tagline,
      tags: channelData.tags,
      videoRoadmap: channelData.videos,
      generatedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(kitData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${channelData.name.toLowerCase().replace(/\s+/g, "-")}-starter-kit.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadBanner = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440" viewBox="0 0 2560 1440">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#09090b" />
        </linearGradient>
      </defs>
      <rect width="2560" height="1440" fill="url(#bgGrad)" />
      <!-- Safe Zone Guidelines (1546x423 centered) -->
      <rect x="507" y="508" width="1546" height="423" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" rx="16" />
      <text x="1280" y="660" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="76" fill="#ffffff" text-anchor="middle" letter-spacing="4">${channelData.name.toUpperCase()}</text>
      <text x="1280" y="740" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="32" fill="rgba(255,255,255,0.75)" text-anchor="middle" letter-spacing="2">${channelData.tagline.replace(/[<>&]/g, "")}</text>
      <text x="1280" y="810" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="24" fill="#6366f1" text-anchor="middle" letter-spacing="3">${channelData.handle.toUpperCase()} • OFFICIAL CHANNEL</text>
    </svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${channelData.name.toLowerCase().replace(/\s+/g, "-")}-banner-2560x1440.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadLogo = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="#020617" />
      <rect x="150" y="150" width="500" height="500" rx="160" fill="url(#logoGrad)" />
      <text x="400" y="465" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="200" fill="#ffffff" text-anchor="middle">${channelData.logoSymbol}</text>
    </svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${channelData.name.toLowerCase().replace(/\s+/g, "-")}-logo-800x800.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWatermark = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
      <defs>
        <linearGradient id="wmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="140" height="140" rx="35" fill="url(#wmGrad)" stroke="rgba(255,255,255,0.4)" stroke-width="3" />
      <text x="75" y="92" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle">${channelData.logoSymbol}</text>
    </svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${channelData.name.toLowerCase().replace(/\s+/g, "-")}-watermark-150x150.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const generatedProjectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      let finalProjectId = generatedProjectId;

      const projectPayload = {
        title: channelData.name,
        targetNiche: idea,
        description: channelData.tagline,
        profile: {
          primaryNiche: idea,
          subNiches: ["Growth Protocols", "Visual Breakdown", "Case Studies"],
          targetAudience: "YouTube viewers seeking high retention content",
          valueProposition: channelData.tagline,
          toneOfVoice: "Engaging and authoritative",
          contentPillars: ["Core Guides", "Tutorials", "Deep Dives"],
        },
        brandKit: {
          primaryColor: "#4F46E5",
          secondaryColor: "#06B6D4",
          accentColor: "#F59E0B",
          backgroundColor: "#0B0F17",
          headlineFont: "Plus Jakarta Sans",
          bodyFont: "Inter",
          visualStyle: "Modern High-Contrast Vector",
          tagline: channelData.tagline,
        },
        channelNames: [
          {
            name: channelData.name,
            handle: channelData.handle,
            isPrimary: true,
          },
        ],
        keywords: channelData.tags.map((t, idx) => ({
          keyword: t.replace(/^#/, ""),
          searchVolume: 45000 - idx * 5000,
          competition: idx % 2 === 0 ? "Medium" : "Low",
        })),
        contentIdeas: channelData.videos.map((v) => ({
          title: v.title,
          hook: `How to master ${v.title} with high retention.`,
          description: `A structured YouTube video exploring ${v.title}.`,
          format: v.type,
          targetLengthMinutes: parseInt(v.duration.split(":")[0], 10) || 12,
          estimatedViews: v.views,
          difficulty: "Intermediate",
          tags: channelData.tags.slice(0, 3),
        })),
      };

      // 1. Save directly to Cloud Firestore using Firebase Web SDK if user is authenticated
      if (user?.uid) {
        try {
          await saveProjectToFirestore({
            projectId: generatedProjectId,
            userId: user.uid,
            projectData: projectPayload,
          });
          finalProjectId = generatedProjectId;
        } catch (clientFsErr) {
          console.warn("Direct client Firestore write notice (falling back to API):", clientFsErr);
        }
      }

      // 2. Also dispatch to server API route /api/projects
      const token = await getIdToken();
      const authHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        authHeaders["Authorization"] = `Bearer ${token}`;
      }

      try {
        const projRes = await fetch("/api/projects", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(projectPayload),
        });
        if (projRes.ok) {
          const apiData = await projRes.json();
          if (apiData.project?.id) {
            finalProjectId = apiData.project.id;
          }
        }
      } catch (apiErr) {
        console.warn("API route save notice:", apiErr);
      }

      setSavedProjectId(finalProjectId);

      // 3. Process assets with Firebase Storage & Firestore Web SDK
      const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440" viewBox="0 0 2560 1440"><rect width="2560" height="1440" fill="#0f172a"/><text x="1280" y="720" font-size="72" fill="#fff" text-anchor="middle">${channelData.name}</text></svg>`;
      const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#4f46e5"/><text x="400" y="460" font-size="200" fill="#fff" text-anchor="middle">${channelData.logoSymbol}</text></svg>`;
      const watermarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r="65" fill="#4f46e5"/><text x="75" y="92" font-size="52" fill="#fff" text-anchor="middle">${channelData.logoSymbol}</text></svg>`;
      const kitJson = JSON.stringify({
        channel: channelData.name,
        handle: channelData.handle,
        tagline: channelData.tagline,
        tags: channelData.tags,
        videoRoadmap: channelData.videos,
      }, null, 2);

      // Direct Firebase Web SDK Storage upload if user is signed in
      if (user?.uid) {
        try {
          const bannerBlob = new Blob([bannerSvg], { type: "image/svg+xml" });
          const logoBlob = new Blob([logoSvg], { type: "image/svg+xml" });
          const watermarkBlob = new Blob([watermarkSvg], { type: "image/svg+xml" });
          const kitBlob = new Blob([kitJson], { type: "application/json" });

          const bannerUpload = await uploadAssetFile({
            userId: user.uid,
            projectId: finalProjectId,
            assetId: `ast_${finalProjectId}_banner`,
            filename: "banner.svg",
            file: bannerBlob,
            contentType: "image/svg+xml",
          }).catch(() => null);

          await saveAssetToFirestore({
            id: `asset_${finalProjectId}_banner`,
            projectId: finalProjectId,
            userId: user.uid,
            assetType: "banner",
            storageKey: bannerUpload?.storageKey || `projects/${finalProjectId}/banner/banner.svg`,
            storageUrl: bannerUpload?.downloadUrl || null,
            mimeType: "image/svg+xml",
            width: 2560,
            height: 1440,
          }).catch(() => null);

          const logoUpload = await uploadAssetFile({
            userId: user.uid,
            projectId: finalProjectId,
            assetId: `ast_${finalProjectId}_avatar`,
            filename: "avatar.svg",
            file: logoBlob,
            contentType: "image/svg+xml",
          }).catch(() => null);

          await saveAssetToFirestore({
            id: `asset_${finalProjectId}_avatar`,
            projectId: finalProjectId,
            userId: user.uid,
            assetType: "avatar",
            storageKey: logoUpload?.storageKey || `projects/${finalProjectId}/avatar/avatar.svg`,
            storageUrl: logoUpload?.downloadUrl || null,
            mimeType: "image/svg+xml",
            width: 800,
            height: 800,
          }).catch(() => null);
        } catch (storageErr) {
          console.warn("Direct Firebase Storage client upload notice:", storageErr);
        }
      }

      // Also call /api/assets route for complete server integration
      await Promise.allSettled([
        fetch("/api/assets", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            projectId: finalProjectId,
            assetType: "banner",
            filename: `${channelData.name.toLowerCase().replace(/\s+/g, "-")}-banner.svg`,
            base64Data: btoa(bannerSvg),
            mimeType: "image/svg+xml",
            width: 2560,
            height: 1440,
          }),
        }),
        fetch("/api/assets", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            projectId: finalProjectId,
            assetType: "avatar",
            filename: `${channelData.name.toLowerCase().replace(/\s+/g, "-")}-avatar.svg`,
            base64Data: btoa(logoSvg),
            mimeType: "image/svg+xml",
            width: 800,
            height: 800,
          }),
        }),
        fetch("/api/assets", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            projectId: finalProjectId,
            assetType: "watermark",
            filename: `${channelData.name.toLowerCase().replace(/\s+/g, "-")}-watermark.svg`,
            base64Data: btoa(watermarkSvg),
            mimeType: "image/svg+xml",
            width: 150,
            height: 150,
          }),
        }),
        fetch("/api/assets", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            projectId: finalProjectId,
            assetType: "downloadable_kit",
            filename: `${channelData.name.toLowerCase().replace(/\s+/g, "-")}-kit.json`,
            base64Data: btoa(kitJson),
            mimeType: "application/json",
          }),
        }),
      ]);

      setSaveMessage("Saved to Cloud Firestore & Storage!");
    } catch (err: any) {
      setSaveMessage(err.message || "Could not save to Database");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl min-h-screen">
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" asChild className="mb-2 -ml-3 text-muted-foreground text-xs sm:text-sm">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Home
            </Link>
          </Button>
          <PageHeader 
            title={status === "generating" ? "Generating Channel Kit..." : "Your Complete Creator Kit"} 
            description={status === "generating" ? stageText : "Your channel branding, visual assets, and content roadmap are ready."} 
          />
        </div>

        {status === "completed" && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <Button variant="outline" asChild className="rounded-xl w-full sm:w-auto min-h-[42px] text-xs sm:text-sm font-semibold">
              <Link href="/">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Another Prompt
              </Link>
            </Button>
            <Button onClick={handleDownloadKit} variant="outline" className="rounded-xl shadow-sm w-full sm:w-auto min-h-[42px] text-xs sm:text-sm font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Kit (.JSON)
            </Button>
            <Button
              onClick={handleSaveToCloud}
              disabled={isSaving || !!savedProjectId}
              className="rounded-xl shadow-sm w-full sm:w-auto min-h-[42px] text-xs sm:text-sm font-semibold bg-primary text-primary-foreground"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : savedProjectId ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" /> Saved to Projects
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4 mr-2" /> Save Project
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {saveMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>{saveMessage}</span>
          </div>
          {savedProjectId && (
            <Button asChild size="sm" variant="outline" className="rounded-xl text-xs shrink-0">
              <Link href="/projects">
                <BookmarkCheck className="w-3.5 h-3.5 mr-1.5" /> View in Projects
              </Link>
            </Button>
          )}
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        <GenerationCard 
          status={status} 
          prompt={idea} 
          progress={progress} 
        />

        {status === "completed" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* 1. Brand Identity Overview */}
            <div className="bg-card rounded-2xl sm:rounded-3xl border border-border/80 p-5 sm:p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${channelData.logoGradient} flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl shadow-md shrink-0`}>
                    {channelData.logoSymbol}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">{channelData.name}</h2>
                    <div className="text-xs sm:text-sm font-medium text-primary truncate">{channelData.handle}</div>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 font-semibold text-xs self-start sm:self-auto shrink-0">
                  Ready for YouTube Setup
                </Badge>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Channel Hook & Positioning
                </h4>
                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  &ldquo;{channelData.tagline}&rdquo;
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-primary" /> Recommended SEO Keywords & Tags
                  </h4>
                  <button
                    onClick={handleCopyTags}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
                  >
                    {copiedTag ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copiedTag ? "Copied!" : "Copy All Tags"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {channelData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 sm:px-3 py-1 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium border border-border/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Visual Assets */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" /> Visual Brand Assets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <AssetCard
                  title="YouTube Channel Banner"
                  type="image"
                  badgeText="2560x1440 Spec"
                  actionText="Download Banner (SVG)"
                  onAction={handleDownloadBanner}
                >
                  <div className={`w-full h-full bg-gradient-to-r ${channelData.bannerGradient} flex flex-col items-center justify-center p-4 sm:p-6 text-center text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-primary-foreground/70 mb-1">
                      OFFICIAL CHANNEL
                    </span>
                    <span className="font-black text-base sm:text-xl md:text-2xl tracking-wider uppercase drop-shadow line-clamp-1">
                      {channelData.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-white/80 font-medium tracking-wide mt-1 max-w-sm line-clamp-1">
                      {channelData.tagline}
                    </span>
                  </div>
                </AssetCard>

                <AssetCard
                  title="Avatar & Logo Mark"
                  type="image"
                  badgeText="800x800 Vector"
                  actionText="Download Logo (SVG)"
                  onAction={handleDownloadLogo}
                >
                  <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr ${channelData.logoGradient} flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl`}>
                      {channelData.logoSymbol}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono mt-2 sm:mt-3">High-Res Square Icon</span>
                  </div>
                </AssetCard>

                <AssetCard
                  title="Video Watermark"
                  type="image"
                  badgeText="150x150 Corner"
                  actionText="Download Watermark (SVG)"
                  onAction={handleDownloadWatermark}
                >
                  <div className="w-full h-full bg-slate-900/90 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/80 to-cyan-400/80 border border-white/30 flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {channelData.logoSymbol}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono mt-2 sm:mt-3">YouTube Video Overlay</span>
                  </div>
                </AssetCard>
              </div>
            </div>

            {/* 3. Strategic Content Roadmap */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" /> Launch Roadmap & Video Concepts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {channelData.videos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="bg-card p-5 rounded-2xl border border-border/80 shadow-sm space-y-2 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {vid.type}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">{vid.duration}</span>
                    </div>
                    <div className="font-semibold text-foreground text-sm pt-1 leading-snug">
                      {vid.title}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                      <Target className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{vid.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
<<<<<<< HEAD
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateWorkflow />
    </Suspense>
  )
}
=======
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading creator workspace...</div>}>
      <GenerateWorkflow />
    </Suspense>
  );
}

>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
