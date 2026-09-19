import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing - ChannelForge AI",
  description: "Simple, transparent pricing for ChannelForge AI.",
};

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-14 sm:py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-foreground">
              Simple, transparent pricing
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Start for free, upgrade when you need premium image generation and advanced capabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm transition-all hover:shadow-md flex flex-col">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">$0</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Perfect for brainstorming ideas and learning the strategy.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "3 Channel Generations / day",
                  "Text-based strategy",
                  "Basic name ideas",
                  "Content pillar outlines"
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
            
            <div className="rounded-3xl border-2 border-primary bg-card p-6 sm:p-8 shadow-xl shadow-primary/10 relative transform md:-translate-y-2 transition-all hover:shadow-2xl hover:shadow-primary/20 flex flex-col mt-4 md:mt-0">
              <div className="absolute top-0 right-4 sm:right-8 transform -translate-y-1/2 bg-primary text-primary-foreground px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground">Pro Creator</h3>
              <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">$12</span>
                <span className="text-muted-foreground font-medium text-sm sm:text-base">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Full visual brand identity and unlimited generation.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Unlimited Generations",
                  "High-res Logo & Banner Generation",
                  "Advanced SEO Keywords",
                  "1-Click Asset Download Zip",
                  "Priority Email Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full shadow-sm rounded-xl min-h-[44px] font-semibold" asChild>
                <Link href="/signup">Upgrade to Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
