import os

content = """\"use client\";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState("");

  const handleGenerate = () => {
    if (!idea.trim()) return;
    router.push(`/generate?idea=${encodeURIComponent(idea)}`);
  };

  const handleExampleClick = (text: string) => {
    setIdea(text);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-background -z-20" />
          {/* Subtle glowing atmospheric background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <div className="container mx-auto px-4 text-center max-w-[1440px] relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 ring-1 ring-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Channel Generation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground">
              Turn your idea into a <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">complete YouTube brand.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Stop guessing. Generate a professional channel name, SEO-optimized keywords, high-res logo, and content strategy in seconds.
            </p>
            
            <div className="max-w-xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your channel idea..."
                  className="h-14 text-base shadow-sm rounded-2xl px-6 bg-card border-border/60 focus-visible:ring-primary"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-2xl text-base shrink-0 shadow-sm"
                  onClick={handleGenerate}
                  disabled={!idea.trim()}
                >
                  Generate Now
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Try:</span>
                <button
                  onClick={() => handleExampleClick("A cooking channel for busy college students.")}
                  className="hover:text-primary hover:underline underline-offset-4 transition-colors font-medium"
                >
                  Cooking for students
                </button>
                <span className="hidden sm:inline">&bull;</span>
                <button
                  onClick={() => handleExampleClick("A cozy gaming channel without commentary.")}
                  className="hover:text-primary hover:underline underline-offset-4 transition-colors font-medium"
                >
                  Cozy Gaming
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. How it works */}
        <section id="how-it-works" className="py-24 bg-secondary/30 border-b border-border/40">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
                How it works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Go from a blank page to a complete channel kit in four simple steps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Enter your idea", desc: "Just describe what you want your channel to be about." },
                { step: "2", title: "AI creates strategy", desc: "We analyze the niche and generate names, keywords, and pillars." },
                { step: "3", title: "Generate branding", desc: "AI designs your logo, banner, and overall visual identity." },
                { step: "4", title: "Download kit", desc: "Get all your assets packaged and ready to upload to YouTube." },
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <div className="w-12 h-12 mx-auto rounded-full bg-card border border-border/60 shadow-sm flex items-center justify-center text-lg font-bold text-primary mb-6 group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Features Grid */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
                Everything you need to start
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                ChannelForge generates a complete toolkit so you can focus on creating videos, not struggling with branding.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Type, title: "Name & Handle Generation", desc: "Get catchy, memorable channel names and available @handles." },
                { icon: Palette, title: "Visual Identity", desc: "AI-generated color palettes, typography suggestions, and mood boards." },
                { icon: ImageIcon, title: "Logos & Banners", desc: "High-resolution, YouTube-optimized profile pictures and cover art." },
                { icon: Target, title: "SEO Keywords", desc: "Data-backed channel tags and keywords to help the algorithm find you." },
                { icon: KeySquare, title: "Content Pillars", desc: "Strategic content categories to keep your uploads consistent." },
                { icon: Video, title: "First 5 Video Ideas", desc: "Proven video concepts with titles and hook suggestions to launch strong." },
              ].map((feature, i) => (
                <div key={i} className="bg-card border border-border/60 shadow-sm rounded-2xl p-6 text-left hover:shadow-md hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Interactive Demo */}
        <section id="demo" className="py-24 bg-secondary/30 border-y border-border/40">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/3 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  See it in action
                </h2>
                <p className="text-muted-foreground text-lg">
                  Here is an example of what ChannelForge generates from the prompt <strong>&ldquo;The Math of AI&rdquo;</strong>.
                </p>
                <div className="space-y-4 pt-4">
                  {[
                    "Cohesive branding across all assets",
                    "Optimized for YouTube dimensions",
                    "Strategic keyword targeting"
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{text}</p>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 shadow-sm" onClick={() => handleExampleClick("The Math of AI")}>
                  Try this prompt <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="lg:w-2/3 w-full">
                {/* Mockup Window */}
                <div className="bg-card rounded-2xl border border-border/60 shadow-xl overflow-hidden">
                  <div className="bg-muted/50 border-b border-border/60 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    <div className="mx-auto bg-background border border-border/60 rounded-md px-3 py-1 text-xs text-muted-foreground w-1/2 text-center truncate">
                      channelforge.ai/brand/math-of-ai
                    </div>
                  </div>
                  <div className="p-6 md:p-8 space-y-6 bg-background">
                    <GenerationCard status="completed" prompt="The Math of AI" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AssetCard title="Channel Banner" type="image" badgeText="2560x1440">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center p-4">
                          <span className="text-white font-bold text-xl tracking-widest opacity-90">
                            THE MATH OF AI
                          </span>
                        </div>
                      </AssetCard>
                      <AssetCard title="Profile Logo" type="image" badgeText="800x800">
                        <div className="w-full h-full bg-slate-950 flex items-center justify-center p-4">
                          <span className="text-white font-bold text-5xl opacity-90 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">∑</span>
                        </div>
                      </AssetCard>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Before/After */}
        <section className="py-24 bg-primary text-primary-foreground dark:bg-zinc-950">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-12">The ChannelForge Difference</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-8 text-left space-y-4">
                <div className="inline-flex items-center rounded-full bg-red-500/20 text-red-100 px-3 py-1 text-sm font-medium mb-4">Without AI</div>
                <p className="text-primary-foreground/80 font-medium">Hours spent brainstorming names.</p>
                <p className="text-primary-foreground/80 font-medium">Paying $50+ on Fiverr for a basic logo.</p>
                <p className="text-primary-foreground/80 font-medium">Guessing which keywords will rank.</p>
                <p className="text-primary-foreground/80 font-medium">Staring at a blank screen for video ideas.</p>
              </div>
              
              <div className="bg-background text-foreground border border-border/60 rounded-2xl p-8 text-left space-y-4 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Sparkles className="w-32 h-32 text-primary" />
                </div>
                <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4 relative z-10 border border-primary/20">
                  With ChannelForge
                </div>
                <p className="relative z-10 font-semibold">Instant name generation & validation.</p>
                <p className="relative z-10 font-semibold">Professional brand assets in seconds.</p>
                <p className="relative z-10 font-semibold">Data-backed SEO strategy.</p>
                <p className="relative z-10 font-semibold">A roadmap of proven video concepts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Pricing Preview */}
        <section id="pricing" className="py-24 bg-background border-b border-border/40">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
                Simple, transparent pricing
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Start for free, upgrade when you need premium image generation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-2xl font-semibold mb-2 text-foreground">Starter</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">$0</span>
                </div>
                <p className="text-muted-foreground mb-6">
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
                <Button className="w-full shadow-sm" variant="outline" onClick={() => window.scrollTo(0, 0)}>
                  Start Free
                </Button>
              </div>
              
              <div className="rounded-3xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10 relative transform md:-translate-y-2 transition-all hover:shadow-2xl hover:shadow-primary/20">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  Most Popular
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-foreground">Pro Creator</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">$12</span>
                  <span className="text-muted-foreground font-medium">/mo</span>
                </div>
                <p className="text-muted-foreground mb-6">
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
                <Button className="w-full shadow-sm" onClick={() => window.scrollTo(0, 0)}>
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Frequently asked questions
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full bg-card rounded-2xl border border-border/60 shadow-sm px-6">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-semibold">Do I own the generated brand assets?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes. All generated text, names, and images are fully yours to use commercially for your YouTube channel and associated businesses.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-semibold">What AI models do you use?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We use state-of-the-art models including Google's Gemini for strategic text generation and advanced diffusion models for high-quality channel art and logos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-left font-semibold">Can I edit the generated designs?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Currently, we provide flattened high-resolution PNGs and JPEGs. We recommend using tools like Figma or Canva if you wish to layer text over the generated background banners.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* 8. Final CTA */}
        <section className="py-32 bg-background border-t border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
            <h2 className="text-4xl font-bold tracking-tight mb-6 text-foreground">
              Ready to launch?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Stop procrastinating. Generate your complete channel identity right now and start recording your first video today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your channel idea..."
                className="h-14 text-base shadow-sm rounded-2xl px-6 bg-card border-border/60 focus-visible:ring-primary"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <Button
                size="lg"
                className="h-14 px-8 rounded-2xl text-base shrink-0 shadow-sm"
                onClick={handleGenerate}
                disabled={!idea.trim()}
              >
                Generate Now
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
"""

with open('app/page.tsx', 'w') as f:
    f.write(content)

print("Page updated successfully!")
