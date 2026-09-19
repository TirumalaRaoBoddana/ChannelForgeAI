import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Palette,
  Video,
  Target,
  Sparkles,
  Play,
  TrendingUp,
  Hash,
  Layers,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product - ChannelForge AI",
  description: "Learn how ChannelForge AI generates complete YouTube brands and content strategies.",
};

export default function ProductPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-24">
        {/* Header */}
        <section className="pt-14 pb-12 sm:pt-20 sm:pb-16 px-4 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-6 ring-1 ring-primary/20">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Comprehensive Creator Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
            The Complete YouTube Creator Kit
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            ChannelForge AI doesn&apos;t just generate a name. It builds a cohesive strategy, visual identity, and content roadmap tailored to your exact niche.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Button size="lg" asChild className="rounded-2xl shadow-sm min-h-[44px] w-full sm:w-auto font-semibold">
              <Link href="/generate">Launch Creator Studio</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-2xl min-h-[44px] w-full sm:w-auto font-semibold">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </section>

        {/* Sections */}
        <div className="container mx-auto px-4 max-w-[1440px] space-y-16 sm:space-y-24">
          
          {/* Strategy */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">Channel Strategy</h2>
              <p className="text-lg text-muted-foreground">
                Start with a solid foundation. Our AI analyzes your idea and defines exactly how you should position yourself in the market.
              </p>
              <ul className="space-y-3">
                {["Target Audience Profiling", "Channel Positioning & Hook", "Optimized Channel Description", "Data-Backed SEO Keywords"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filled Strategy Preview Container */}
            <div className="bg-secondary/30 rounded-3xl p-6 md:p-8 border border-border/60">
              <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Niche Analysis Report
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15">
                    High Growth Score: 94/100
                  </Badge>
                </div>

                <div>
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                    Primary Hook & Identity
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    DeskCraft Studio &bull; Minimalist WFH Blueprints
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    &ldquo;Helping software developers and remote creators design clean, ergonomic workspaces on realistic budgets.&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50">
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Target className="w-3.5 h-3.5 text-primary" /> Target Audience
                    </div>
                    <div className="text-sm font-semibold text-foreground">Remote Tech Workers (24-38)</div>
                    <div className="text-xs text-muted-foreground mt-0.5">High purchasing intent &bull; Tech focused</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50">
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Competitive Edge
                    </div>
                    <div className="text-sm font-semibold text-foreground">Zero-Cable Ergonomics</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Focus on clean setups under $500</div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-primary" /> High-Ranked SEO Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["#DeskSetup", "#MinimalTech", "#WFHWorkspace", "#HomeOfficeTour", "#CableManagement"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium border border-border/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Brand */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
            {/* Filled Brand Preview Container */}
            <div className="bg-secondary/30 rounded-3xl p-6 md:p-8 border border-border/60 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Logo Card */}
                  <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Logo Mark</span>
                      <Badge variant="outline" className="text-[10px] py-0">4K Vector</Badge>
                    </div>
                    <div className="py-3 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-violet-400 flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
                        DC
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">DeskCraft</div>
                        <div className="text-xs text-muted-foreground">Minimal Monogram</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      Optimized for YouTube circular avatar crop
                    </div>
                  </div>

                  {/* Palette Card */}
                  <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand Palette</span>
                      <Badge variant="outline" className="text-[10px] py-0">WCAG AA</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 py-2">
                      <div className="space-y-1 text-center">
                        <div className="h-9 sm:h-10 rounded-lg bg-slate-900 shadow-inner" />
                        <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground block truncate">#0F172A</span>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="h-9 sm:h-10 rounded-lg bg-indigo-600 shadow-inner" />
                        <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground block truncate">#4F46E5</span>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="h-9 sm:h-10 rounded-lg bg-emerald-500 shadow-inner" />
                        <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground block truncate">#10B981</span>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="h-9 sm:h-10 rounded-lg bg-slate-100 border border-border shadow-inner" />
                        <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground block truncate">#F8FAFC</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      Contrast-tested thumbnail & banner pairings
                    </div>
                  </div>
                </div>

                {/* Banner Card */}
                <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Channel Art &bull; 2560 &times; 1440 YouTube Spec
                    </span>
                    <Badge variant="secondary" className="text-[10px] text-primary">Safe-Zone Centered</Badge>
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-slate-800 p-5 text-white flex flex-col justify-center items-center text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                    <div className="relative z-10 space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-indigo-300 text-[10px] font-semibold tracking-wider uppercase mb-1">
                        <Sparkles className="w-2.5 h-2.5" /> Official Channel
                      </div>
                      <div className="font-extrabold text-base tracking-wider uppercase sm:text-lg">
                        DESKCRAFT STUDIO
                      </div>
                      <div className="text-[11px] text-slate-300 font-medium">
                        MINIMAL WORKSPACE BLUEPRINTS &bull; NEW VIDEOS EVERY SUNDAY
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Palette className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">Brand Generation</h2>
              <p className="text-lg text-muted-foreground">
                Look professional from day one. We generate cohesive visual assets that look like you hired a designer.
              </p>
              <ul className="space-y-3">
                {["High-Resolution Logo", "YouTube-Optimized Banner", "Brand Color Palette", "Typography Suggestions"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Content */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">Content Strategy</h2>
              <p className="text-lg text-muted-foreground">
                Never stare at a blank screen. Get a strategic roadmap of video concepts guaranteed to attract your target audience.
              </p>
              <ul className="space-y-3">
                {["Long-form Video Ideas", "YouTube Shorts Concepts", "Clickable Title Suggestions", "Strategic Content Pillars"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filled Content Roadmap Preview Container */}
            <div className="bg-secondary/30 rounded-3xl p-6 md:p-8 border border-border/60">
              <div className="space-y-3.5">
                {[
                  {
                    title: "The $350 Minimal WFH Desk Setup (Zero Cable Clutter)",
                    pillar: "Setup Showcase",
                    duration: "14:20",
                    type: "Long-Form Pillar",
                    stat: "12.4% Est. CTR",
                    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900",
                  },
                  {
                    title: "3 Cheap Cable Management Hacks Every Coder Needs #Shorts",
                    pillar: "Quick Productivity",
                    duration: "0:48",
                    type: "Viral Short",
                    stat: "85% Target Retention",
                    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900",
                  },
                  {
                    title: "Desk Ergonomics Blueprint: How I Fixed Chronic Neck Strain",
                    pillar: "Evergreen Guide",
                    duration: "18:05",
                    type: "Search Intent",
                    stat: "High Evergreen Volume",
                    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-card p-3.5 sm:p-4 rounded-2xl border border-border/80 shadow-sm flex items-start sm:items-center gap-3.5 hover:border-primary/40 transition-colors"
                  >
                    <div className="w-14 sm:w-16 h-11 sm:h-12 rounded-xl bg-secondary flex items-center justify-center relative shrink-0 border border-border/60 group">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-primary text-primary ml-0.5" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-white text-[8px] sm:text-[9px] font-mono leading-none">
                        {item.duration}
                      </span>
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                          {item.type}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Layers className="w-3 h-3" /> {item.pillar}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                        {item.title}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="font-medium text-foreground/80">{item.stat}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-16 sm:mt-24 py-14 sm:py-20 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to build your channel?</h2>
            <p className="text-primary-foreground/80 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
              Get your complete Channel Starter Kit today and organize all your generated assets in one place.
            </p>
            <Button size="lg" variant="secondary" asChild className="rounded-2xl min-h-[44px] px-8 font-semibold">
              <Link href="/generate">Start Creating Free</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

