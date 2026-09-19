import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog & Creator Guides - ChannelForge AI",
  description: "Comprehensive guides, YouTube dimensions, branding frameworks, and growth strategies for modern video creators.",
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-20 bg-background">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Creator Knowledge Base
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              YouTube Strategy & Branding Guides
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Step-by-step answers, design dimensions, and algorithmic frameworks to help you launch and scale your channel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group bg-card border border-border/70 rounded-3xl p-7 shadow-sm transition-all hover:shadow-md hover:border-primary/40 flex flex-col h-full"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge variant="secondary" className="font-semibold text-xs rounded-lg px-2.5 py-0.5">
                    {post.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">{post.date}</span>
                  <Button variant="ghost" size="sm" className="p-0 h-auto font-semibold hover:bg-transparent hover:text-primary" asChild>
                    <Link href={`/blog/${post.slug}`} className="flex items-center text-sm">
                      Read more <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
