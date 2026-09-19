import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy - ChannelForge AI",
  description: "Learn how ChannelForge AI collects, protects, and handles your data.",
};

export default function PrivacyPage() {
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
              <Shield className="w-3.5 h-3.5" />
              Privacy & Security
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-base">
              Last updated: September 15, 2026 &bull; Effective immediately
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-10 text-foreground/90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" /> 1. Information We Collect
              </h2>
              <p className="text-muted-foreground">
                ChannelForge AI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. We collect only information necessary to generate YouTube branding kits, provide account management, and maintain platform security:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Account Information:</strong> When you register via email or Google OAuth, we receive your name, email address, and profile picture.
                </li>
                <li>
                  <strong className="text-foreground">Channel Generation Prompts:</strong> The channel ideas, niche queries, and keywords you submit to generate branding assets and content roadmaps.
                </li>
                <li>
                  <strong className="text-foreground">Generated Assets:</strong> Saved channel kits, logos, banners, and video outlines associated with your account.
                </li>
                <li>
                  <strong className="text-foreground">Usage Data:</strong> Anonymized interaction metrics (such as page views, button clicks, and feature usage) to improve performance.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> 2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground">
                We use collected information strictly for the following operational purposes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Delivering AI-generated branding assets and roadmaps",
                  "Syncing your saved projects across your sessions",
                  "Authenticating your identity securely",
                  "Providing customer and priority email support",
                  "Preventing abusive automated scrapers or rate-limit violations",
                  "Continuously refining generator accuracy and responsiveness"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-card border border-border/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> 3. Data Ownership & Commercial Rights
              </h2>
              <p className="text-muted-foreground">
                You retain full ownership of the channel concepts, titles, descriptions, and visual assets generated for your brand through ChannelForge AI. We do not sell your personal data, prompt history, or generated assets to third-party data brokers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Third-Party Services & AI Providers</h2>
              <p className="text-muted-foreground">
                To process your requests, ChannelForge AI interfaces with reputable enterprise infrastructure providers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Google Cloud & Gemini Models:</strong> Utilized for advanced natural language synthesis and keyword analysis.
                </li>
                <li>
                  <strong className="text-foreground">Authentication Providers:</strong> Google Identity Services when you sign in via Google OAuth.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Your Rights & Data Deletion</h2>
              <p className="text-muted-foreground">
                You may review, update, or permanently delete your account and associated project data at any time from your Account Settings page, or by contacting our team at privacy@channelforge.ai.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Questions regarding our privacy practices? Reach out to support@channelforge.ai.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/terms">View Terms of Service</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
