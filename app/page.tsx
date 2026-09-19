"use client";

<<<<<<< HEAD
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AssetCard } from "@/components/custom/asset-card";
import { GenerationCard } from "@/components/custom/generation-card";
import { Sparkles, Type, Image as ImageIcon, MonitorPlay, FileBadge, KeySquare, Video, Palette, Target, CheckCircle2 } from "lucide-react";
=======
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AssetCard } from "@/components/custom/asset-card";
import { GenerationCard } from "@/components/custom/generation-card";
import {
  Sparkles,
  Type,
  Image as ImageIcon,
  MonitorPlay,
  FileBadge,
  KeySquare,
  Video,
  Palette,
  Target,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const DEMO_PRESETS = [
  {
    id: "math",
    title: "The Math of AI",
    badge: "Tech & Science",
    url: "channelforge.ai/brand/math-of-ai",
    bannerTitle: "THE MATH OF AI",
    bannerSubtitle: "LINEAR ALGEBRA & CALCULUS FOR MACHINE LEARNING",
    bannerGradient: "from-indigo-950 via-slate-900 to-indigo-900",
    logoSymbol: "∑",
    logoGradient: "from-indigo-400 to-cyan-400",
  },
  {
    id: "coding",
    title: "Cozy Coffee & Code",
    badge: "Lifestyle & Tech",
    url: "channelforge.ai/brand/coffee-code",
    bannerTitle: "COZY COFFEE & CODE",
    bannerSubtitle: "RELAXING CODING SESSIONS & MINIMAL DEV WORKSPACES",
    bannerGradient: "from-amber-950 via-stone-900 to-zinc-900",
    logoSymbol: "☕",
    logoGradient: "from-amber-400 to-orange-300",
  },
  {
    id: "cooking",
    title: "15-Minute Dorm Chef",
    badge: "Food & Student",
    url: "channelforge.ai/brand/dorm-chef",
    bannerTitle: "15-MIN DORM CHEF",
    bannerSubtitle: "CHEAP & DELICIOUS RECIPES FOR BUSY STUDENTS",
    bannerGradient: "from-emerald-950 via-slate-900 to-teal-950",
    logoSymbol: "🍳",
    logoGradient: "from-emerald-400 to-teal-300",
  },
];
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
<<<<<<< HEAD

  const handleGenerate = () => {
    if (!idea.trim()) return;
    router.push(`/generate?idea=${encodeURIComponent(idea)}`);
=======
  const [selectedDemoId, setSelectedDemoId] = useState("math");
  const heroInputRef = useRef<HTMLInputElement>(null);

  const selectedDemo = DEMO_PRESETS.find((p) => p.id === selectedDemoId) || DEMO_PRESETS[0];

  const handleGenerate = () => {
    if (!idea.trim()) return;
    router.push(`/generate?idea=${encodeURIComponent(idea.trim())}`);
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
  };

  const handleExampleClick = (text: string) => {
    setIdea(text);
<<<<<<< HEAD
=======
    if (heroInputRef.current) {
      heroInputRef.current.focus();
      heroInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleTryPrompt = (text: string) => {
    setIdea(text);
    router.push(`/generate?idea=${encodeURIComponent(text.trim())}`);
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
<<<<<<< HEAD
        
        {/* 1. Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden border-b">
          <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950 -z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
          
          <div className="container mx-auto px-4 text-center max-w-[1440px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>ChannelForge AI 1.0 is now live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground max-w-4xl mx-auto leading-tight">
              Launch Your YouTube Channel <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">With AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
              From one simple idea, generate your channel name, branding, keywords, content strategy and visual identity.
            </p>
            
            <div className="max-w-xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  value={idea} 
                  onChange={(e) => setIdea(e.target.value)} 
                  placeholder="Describe your channel idea..." 
                  className="h-14 text-base shadow-sm rounded-2xl px-6"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
                <Button 
                  size="lg" 
                  className="h-14 px-8 rounded-2xl text-base shrink-0" 
                  onClick={handleGenerate}
                  disabled={!idea.trim()}
                >
                  Generate My Channel
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span>Try an example:</span>
                <button onClick={() => handleExampleClick("I want to create a channel explaining AI and mathematics to beginners.")} className="hover:text-foreground hover:underline underline-offset-4 transition-colors">AI and Mathematics</button>
                <span className="hidden sm:inline">&bull;</span>
                <button onClick={() => handleExampleClick("A cozy gaming channel without commentary.")} className="hover:text-foreground hover:underline underline-offset-4 transition-colors">Cozy Gaming</button>
=======
        {/* 1. Hero Section */}
        <section className="relative pt-16 pb-14 sm:pt-24 sm:pb-20 md:pt-36 md:pb-28 overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-background -z-20" />
          {/* Subtle glowing atmospheric background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <div className="container mx-auto px-4 text-center max-w-[1440px] relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-6 sm:mb-8 ring-1 ring-primary/20">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>AI-Powered Channel Generation</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 sm:mb-8 text-foreground leading-[1.12]">
              Turn your idea into a <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">complete YouTube brand.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Stop guessing. Generate a professional channel name, SEO-optimized keywords, high-res logo, and content strategy in seconds.
            </p>
            
            <div className="max-w-xl mx-auto space-y-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  ref={heroInputRef}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your channel idea..."
                  className="h-12 sm:h-14 text-sm sm:text-base shadow-sm rounded-2xl px-5 sm:px-6 bg-card border-border/60 focus-visible:ring-primary w-full"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
                <Button
                  size="lg"
                  className="h-12 sm:h-14 px-7 sm:px-8 rounded-2xl text-sm sm:text-base shrink-0 shadow-sm w-full sm:w-auto font-semibold"
                  onClick={handleGenerate}
                  disabled={!idea.trim()}
                >
                  Generate Now
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span>Try:</span>
                <button
                  onClick={() => handleExampleClick("A cooking channel for busy college students.")}
                  className="hover:text-primary hover:underline underline-offset-4 transition-colors font-medium py-1 px-1.5"
                >
                  Cooking for students
                </button>
                <span className="hidden sm:inline">&bull;</span>
                <button
                  onClick={() => handleExampleClick("A cozy gaming channel without commentary.")}
                  className="hover:text-primary hover:underline underline-offset-4 transition-colors font-medium py-1 px-1.5"
                >
                  Cozy Gaming
                </button>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
              </div>
            </div>
          </div>
        </section>

        {/* 2. How it works */}
<<<<<<< HEAD
        <section id="how-it-works" className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">How it works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Go from a blank page to a complete channel kit in four simple steps.</p>
=======
        <section id="how-it-works" className="py-16 sm:py-20 md:py-24 bg-secondary/30 border-b border-border/40">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
                How it works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Go from a blank page to a complete channel kit in four simple steps.
              </p>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Enter your idea", desc: "Just describe what you want your channel to be about." },
                { step: "2", title: "AI creates strategy", desc: "We analyze the niche and generate names, keywords, and pillars." },
                { step: "3", title: "Generate branding", desc: "AI designs your logo, banner, and overall visual identity." },
<<<<<<< HEAD
                { step: "4", title: "Download kit", desc: "Get all your assets packaged and ready to upload to YouTube." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
=======
                { step: "4", title: "Download kit", desc: "Get all your assets packaged and ready to upload to YouTube." },
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <div className="w-12 h-12 mx-auto rounded-full bg-card border border-border/60 shadow-sm flex items-center justify-center text-lg font-bold text-primary mb-6 group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

<<<<<<< HEAD
        {/* 3. Feature Grid */}
        <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/20 border-y">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to start</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">ChannelForge generates all the metadata and visual assets required for a professional YouTube presence.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Type, title: "AI Channel Names", desc: "Memorable, catchy, and available channel name ideas." },
                { icon: ImageIcon, title: "AI Logo", desc: "Custom generated avatar/logo matching your niche." },
                { icon: MonitorPlay, title: "YouTube Banner", desc: "Perfectly sized channel art that looks great on all devices." },
                { icon: FileBadge, title: "Watermark", desc: "A clean transparent watermark to encourage subscriptions." },
                { icon: KeySquare, title: "SEO Keywords", desc: "High-volume, low-competition tags for your channel settings." },
                { icon: Video, title: "Video Ideas", desc: "Your first 10 video concepts with catchy titles and hooks." },
                { icon: Palette, title: "Brand Kit", desc: "Hex codes, typography, and visual guidelines." },
                { icon: Target, title: "Content Strategy", desc: "Content pillars and target audience personas." }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
=======
        {/* 3. Features Grid */}
        <section id="features" className="py-16 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4 text-foreground">
                Everything you need to start
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                ChannelForge generates a complete toolkit so you can focus on creating videos, not struggling with branding.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[
                { icon: Type, title: "Name & Handle Generation", desc: "Get catchy, memorable channel names and available @handles." },
                { icon: Palette, title: "Visual Identity", desc: "AI-generated color palettes, typography suggestions, and mood boards." },
                { icon: ImageIcon, title: "Logos & Banners", desc: "High-resolution, YouTube-optimized profile pictures and cover art." },
                { icon: Target, title: "SEO Keywords", desc: "Data-backed channel tags and keywords to help the algorithm find you." },
                { icon: KeySquare, title: "Content Pillars", desc: "Strategic content categories to keep your uploads consistent." },
                { icon: Video, title: "First 5 Video Ideas", desc: "Proven video concepts with titles and hook suggestions to launch strong." },
              ].map((feature, i) => (
                <div key={i} className="bg-card border border-border/60 shadow-sm rounded-2xl p-5 sm:p-6 text-left hover:shadow-md hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 sm:mb-6">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
                </div>
              ))}
            </div>
          </div>
        </section>

<<<<<<< HEAD
        {/* 4. Interactive Demo (Static Mock) */}
        <section id="demo" className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/3 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">See it in action</h2>
                <p className="text-muted-foreground text-lg">
                  Here is an example of what ChannelForge generates from the prompt <strong>&ldquo;The Math of AI&rdquo;</strong>.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">Cohesive branding across all assets</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">Optimized for YouTube dimensions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">Strategic keyword targeting</p>
                  </div>
                </div>
                <Button className="mt-4" onClick={() => handleExampleClick("The Math of AI")}>Try this prompt</Button>
              </div>
              
              <div className="lg:w-2/3 w-full bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl p-6 md:p-8 border">
                <div className="space-y-6">
                  <GenerationCard status="completed" prompt="The Math of AI" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AssetCard title="Channel Banner" type="image" badgeText="2560x1440">
                      <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-center p-4">
                        <span className="text-white font-bold text-xl tracking-widest opacity-80">THE MATH OF AI</span>
                      </div>
                    </AssetCard>
                    <AssetCard title="Profile Logo" type="image" badgeText="800x800">
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center p-4">
                         <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                           <span className="text-blue-500 font-bold text-2xl font-serif">∑</span>
                         </div>
                      </div>
                    </AssetCard>
=======
        {/* 4. Interactive Demo */}
        <section id="demo" className="py-16 sm:py-20 md:py-24 bg-secondary/30 border-y border-border/40">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
              <div className="lg:w-1/3 w-full space-y-5 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                  Interactive Live Demo
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  See it in action
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Select a sample prompt below to preview the instant branding kit generated by ChannelForge:
                </p>

                {/* Demo Preset Selector */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {DEMO_PRESETS.map((preset) => {
                    const isSelected = preset.id === selectedDemo.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedDemoId(preset.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border min-h-[38px] flex items-center justify-center ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-card text-muted-foreground border-border/70 hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {preset.title}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    "Cohesive branding across all assets",
                    "Optimized for YouTube dimensions",
                    "Strategic keyword targeting"
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-foreground">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    size="lg"
                    className="shadow-sm rounded-2xl w-full sm:w-auto text-sm sm:text-base font-semibold min-h-[44px]"
                    onClick={() => handleTryPrompt(selectedDemo.title)}
                  >
                    Try this prompt <ChevronRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-2/3 w-full">
                {/* Mockup Window */}
                <div className="bg-card rounded-2xl border border-border/60 shadow-xl overflow-hidden">
                  <div className="bg-muted/50 border-b border-border/60 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80 shrink-0" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80 shrink-0" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80 shrink-0" />
                    <div className="mx-auto bg-background border border-border/60 rounded-md px-3 py-1 text-xs text-muted-foreground max-w-[240px] w-full text-center truncate">
                      {selectedDemo.url}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 bg-background">
                    <GenerationCard status="completed" prompt={selectedDemo.title} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AssetCard
                        title="Channel Banner"
                        type="image"
                        badgeText="2560x1440"
                        actionText="Customize in Studio"
                        onAction={() => handleTryPrompt(selectedDemo.title)}
                      >
                        <div className={`w-full h-full bg-gradient-to-br ${selectedDemo.bannerGradient} flex flex-col items-center justify-center p-4 text-center`}>
                          <span className="text-white font-extrabold text-sm sm:text-base md:text-lg tracking-widest opacity-95 uppercase">
                            {selectedDemo.bannerTitle}
                          </span>
                          <span className="text-white/70 text-[10px] font-medium tracking-wider uppercase mt-1">
                            {selectedDemo.bannerSubtitle}
                          </span>
                        </div>
                      </AssetCard>
                      <AssetCard
                        title="Profile Logo"
                        type="image"
                        badgeText="800x800"
                        actionText="Customize in Studio"
                        onAction={() => handleTryPrompt(selectedDemo.title)}
                      >
                        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4">
                          <span className={`font-bold text-3xl sm:text-4xl md:text-5xl opacity-90 text-transparent bg-clip-text bg-gradient-to-r ${selectedDemo.logoGradient}`}>
                            {selectedDemo.logoSymbol}
                          </span>
                          <span className="text-slate-400 text-[10px] font-mono mt-1">Vector Monogram</span>
                        </div>
                      </AssetCard>
                    </div>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Before/After */}
<<<<<<< HEAD
        <section className="py-24 bg-zinc-950 text-zinc-50">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-12">The ChannelForge Difference</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-left space-y-4">
                <div className="inline-flex items-center rounded-full bg-red-500/10 text-red-400 px-3 py-1 text-sm font-medium mb-4">Without AI</div>
                <p className="text-zinc-400">Hours spent brainstorming names.</p>
                <p className="text-zinc-400">Paying $50+ on Fiverr for a basic logo.</p>
                <p className="text-zinc-400">Guessing which keywords will rank.</p>
                <p className="text-zinc-400">Staring at a blank screen for video ideas.</p>
              </div>
              
              <div className="bg-gradient-to-b from-blue-900/40 to-zinc-900 border border-blue-500/30 rounded-2xl p-8 text-left space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-blue-400" />
                </div>
                <div className="inline-flex items-center rounded-full bg-blue-500/20 text-blue-300 px-3 py-1 text-sm font-medium mb-4 relative z-10">With ChannelForge</div>
                <p className="text-zinc-200 relative z-10 font-medium">Instant name generation & validation.</p>
                <p className="text-zinc-200 relative z-10 font-medium">Professional brand assets in seconds.</p>
                <p className="text-zinc-200 relative z-10 font-medium">Data-backed SEO strategy.</p>
                <p className="text-zinc-200 relative z-10 font-medium">A roadmap of proven video concepts.</p>
=======
        <section className="py-16 sm:py-20 md:py-24 bg-primary text-primary-foreground dark:bg-zinc-950">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12">The ChannelForge Difference</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-6 sm:p-8 text-left space-y-3 sm:space-y-4">
                <div className="inline-flex items-center rounded-full bg-red-500/20 text-red-100 px-3 py-1 text-xs sm:text-sm font-medium mb-2 sm:mb-4">Without AI</div>
                <p className="text-primary-foreground/80 text-sm sm:text-base font-medium">Hours spent brainstorming names.</p>
                <p className="text-primary-foreground/80 text-sm sm:text-base font-medium">Paying $50+ on Fiverr for a basic logo.</p>
                <p className="text-primary-foreground/80 text-sm sm:text-base font-medium">Guessing which keywords will rank.</p>
                <p className="text-primary-foreground/80 text-sm sm:text-base font-medium">Staring at a blank screen for video ideas.</p>
              </div>
              
              <div className="bg-background text-foreground border border-border/60 rounded-2xl p-6 sm:p-8 text-left space-y-3 sm:space-y-4 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Sparkles className="w-32 h-32 text-primary" />
                </div>
                <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs sm:text-sm font-medium mb-2 sm:mb-4 relative z-10 border border-primary/20">
                  With ChannelForge
                </div>
                <p className="relative z-10 font-semibold text-sm sm:text-base">Instant name generation & validation.</p>
                <p className="relative z-10 font-semibold text-sm sm:text-base">Professional brand assets in seconds.</p>
                <p className="relative z-10 font-semibold text-sm sm:text-base">Data-backed SEO strategy.</p>
                <p className="relative z-10 font-semibold text-sm sm:text-base">A roadmap of proven video concepts.</p>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
              </div>
            </div>
          </div>
        </section>

        {/* 6. Pricing Preview */}
<<<<<<< HEAD
        <section id="pricing" className="py-24 bg-background border-b">
          <div className="container mx-auto px-4 max-w-[1440px]">
             <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Start for free, upgrade when you need premium image generation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="rounded-3xl border bg-card p-8 shadow-sm">
                <h3 className="text-2xl font-semibold mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$0</span>
                </div>
                <p className="text-muted-foreground mb-6">Perfect for brainstorming ideas.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> 3 Channel Generations / day</li>
                  <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Text-based strategy</li>
                  <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Basic name ideas</li>
                </ul>
                <Button className="w-full" variant="outline" onClick={() => window.scrollTo(0, 0)}>Start Free</Button>
              </div>
              
              <div className="rounded-3xl border-2 border-primary bg-card p-8 shadow-md relative">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
                <h3 className="text-2xl font-semibold mb-2">Pro Creator</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-muted-foreground mb-6">Full visual brand identity.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited Generations</li>
                  <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> High-res Logo & Banner Generation</li>
                  <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Advanced SEO Keywords</li>
                  <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> 1-Click Asset Download Zip</li>
                </ul>
                <Button className="w-full" onClick={() => window.scrollTo(0, 0)}>Upgrade to Pro</Button>
=======
        <section id="pricing" className="py-16 sm:py-20 md:py-24 bg-background border-b border-border/40">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4 text-foreground">
                Simple, transparent pricing
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                Start for free, upgrade when you need premium image generation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">Starter</h3>
                <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">$0</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Perfect for brainstorming ideas.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "3 Channel Generations / day",
                    "Text-based strategy",
                    "Basic name ideas"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full shadow-sm rounded-xl min-h-[44px]" variant="outline" asChild>
                  <Link href="/signup">Start Free</Link>
                </Button>
              </div>
              
              <div className="rounded-3xl border-2 border-primary bg-card p-6 sm:p-8 shadow-xl shadow-primary/10 relative transform md:-translate-y-2 transition-all hover:shadow-2xl hover:shadow-primary/20 mt-4 md:mt-0">
                <div className="absolute top-0 right-4 sm:right-8 transform -translate-y-1/2 bg-primary text-primary-foreground px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
                  Most Popular
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">Pro Creator</h3>
                <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">$12</span>
                  <span className="text-muted-foreground font-medium text-sm sm:text-base">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Full visual brand identity.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited Generations",
                    "High-res Logo & Banner Generation",
                    "Advanced SEO Keywords",
                    "1-Click Asset Download Zip"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full shadow-sm rounded-xl min-h-[44px] font-semibold" asChild>
                  <Link href="/signup">Upgrade to Pro</Link>
                </Button>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
<<<<<<< HEAD
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full bg-background rounded-2xl border px-6">
              <AccordionItem value="item-1">
                <AccordionTrigger>Do I own the generated brand assets?</AccordionTrigger>
                <AccordionContent>
=======
        <section className="py-16 sm:py-20 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Frequently asked questions
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border border-border/60 shadow-sm px-4 sm:px-6">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base py-4">Do I own the generated brand assets?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
                  Yes. All generated text, names, and images are fully yours to use commercially for your YouTube channel and associated businesses.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
<<<<<<< HEAD
                <AccordionTrigger>What AI models do you use?</AccordionTrigger>
                <AccordionContent>
                  We use state-of-the-art models including Google's Gemini for strategic text generation and advanced diffusion models for high-quality channel art and logos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I edit the generated designs?</AccordionTrigger>
                <AccordionContent>
=======
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base py-4">What AI models do you use?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  We use state-of-the-art models including Google's Gemini for strategic text generation and advanced diffusion models for high-quality channel art and logos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base py-4">Can I edit the generated designs?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
                  Currently, we provide flattened high-resolution PNGs and JPEGs. We recommend using tools like Figma or Canva if you wish to layer text over the generated background banners.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* 8. Final CTA */}
<<<<<<< HEAD
        <section className="py-32 bg-background border-t relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to launch?</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Stop procrastinating. Generate your complete channel identity right now and start recording your first video today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input 
                value={idea} 
                onChange={(e) => setIdea(e.target.value)} 
                placeholder="Describe your channel idea..." 
                className="h-14 text-base shadow-sm rounded-2xl px-6 bg-background"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <Button 
                size="lg" 
                className="h-14 px-8 rounded-2xl text-base shrink-0" 
=======
        <section className="py-20 sm:py-28 md:py-32 bg-background border-t border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground">
              Ready to launch?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
              Stop procrastinating. Generate your complete channel identity right now and start recording your first video today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your channel idea..."
                className="h-12 sm:h-14 text-sm sm:text-base shadow-sm rounded-2xl px-5 sm:px-6 bg-card border-border/60 focus-visible:ring-primary w-full"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <Button
                size="lg"
                className="h-12 sm:h-14 px-7 sm:px-8 rounded-2xl text-sm sm:text-base shrink-0 shadow-sm w-full sm:w-auto font-semibold min-h-[44px]"
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
                onClick={handleGenerate}
                disabled={!idea.trim()}
              >
                Generate Now
              </Button>
            </div>
          </div>
        </section>
<<<<<<< HEAD

=======
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
      </main>
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
