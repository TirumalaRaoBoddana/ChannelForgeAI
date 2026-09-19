import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service - ChannelForge AI",
  description: "Terms and conditions for using ChannelForge AI services and generated assets.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Link>
            </Button>
          </div>

          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              Legal Agreements
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-base">
              Last revised: September 15, 2026 &bull; Please read carefully
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-10 text-foreground/90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using ChannelForge AI (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Use of Generated Assets & Commercial Rights</h2>
              <p className="text-muted-foreground">
                ChannelForge AI empowers creators to generate brand names, visual logos, banner art, SEO tags, and content roadmaps.
              </p>
              <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
                <div className="font-semibold text-foreground text-sm">You are granted full commercial rights to:</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Upload generated banners and logos to your YouTube channel and social profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Monetize YouTube videos produced using our suggested titles, hooks, and roadmaps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Incorporate generated graphics into merchandise, digital products, and thumbnails</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Acceptable Use Policy</h2>
              <p className="text-muted-foreground">
                You agree not to use the Service to generate content that promotes hate speech, harassment, unlawful acts, infringement of registered trademarks, or deceptive impersonation of real individuals or entities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Subscriptions & Billing</h2>
              <p className="text-muted-foreground">
                ChannelForge AI offers a free tier as well as paid monthly subscriptions (such as Pro Creator). Paid subscriptions renew automatically at the beginning of each billing cycle unless cancelled prior to the renewal date. You may cancel your plan at any time from your Account page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                ChannelForge AI provides strategic and visual suggestions &ldquo;as is&rdquo;. While we strive for highest quality, we cannot guarantee specific YouTube view counts, subscriber milestones, or algorithmic ranking performance.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Questions regarding these terms? Contact legal@channelforge.ai.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/privacy">Read Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
