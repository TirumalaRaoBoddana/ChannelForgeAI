import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Info,
  Sparkles,
  HelpCircle,
  Share2,
  Bookmark
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import { ShareButton } from "@/components/custom/share-button";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found - ChannelForge AI",
    };
  }

  return {
    title: `${post.title} | ChannelForge Creator Hub`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 2);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 md:py-20 bg-background">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Top Breadcrumb & Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Creator Hub
            </Link>

            <Badge variant="outline" className="font-semibold text-xs py-1 px-3">
              {post.category}
            </Badge>
          </div>

          {/* Article Header */}
          <header className="space-y-6 pb-10 border-b border-border/70">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {post.subtitle}
            </p>

            {/* Author Byline */}
            <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                  {post.author.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{post.author.name}</div>
                  <div className="text-xs text-muted-foreground">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShareButton title={post.title} />
              </div>
            </div>
          </header>

          {/* Key Takeaways / Instant Answer Box */}
          <div className="my-10 p-6 md:p-8 rounded-3xl bg-primary/[0.03] border border-primary/20 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-base">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Key Takeaways & Quick Answer</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {post.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-foreground leading-snug">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Main Body */}
          <div className="space-y-12 text-foreground/90">
            {post.sections.map((sec, sIdx) => (
              <section key={sIdx} className="space-y-5">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground pt-4">
                  {sec.heading}
                </h2>

                <div className="space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
                  {sec.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-foreground/90">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Optional Spec or Comparison Table */}
                {sec.table && (
                  <div className="my-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-muted/70 border-b border-border text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                          <tr>
                            {sec.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3.5">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-3.5 font-medium text-foreground">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Optional Callout / Pro Tip */}
                {sec.callout && (
                  <div
                    className={`my-6 p-5 rounded-2xl border flex items-start gap-4 ${
                      sec.callout.type === "warning"
                        ? "bg-amber-500/5 border-amber-500/30 text-amber-950 dark:text-amber-100"
                        : sec.callout.type === "spec"
                        ? "bg-blue-500/5 border-blue-500/30 text-blue-950 dark:text-blue-100"
                        : "bg-emerald-500/5 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-background shrink-0 mt-0.5 shadow-xs">
                      {sec.callout.type === "warning" ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      ) : sec.callout.type === "spec" ? (
                        <Info className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Lightbulb className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1 text-foreground">
                        {sec.callout.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {sec.callout.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Optional Key Points List */}
                {sec.keyPoints && sec.keyPoints.length > 0 && (
                  <div className="p-5 rounded-2xl bg-card border border-border/70 my-4 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Actionable Checklist:
                    </h4>
                    <ul className="space-y-2">
                      {sec.keyPoints.map((point, kIdx) => (
                        <li key={kIdx} className="flex items-start gap-2.5 text-sm text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* FAQ Section */}
          {post.faq && post.faq.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border/70 space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {post.faq.map((item, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2"
                  >
                    <h3 className="text-base font-bold text-foreground">
                      {item.question}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive CTA Banner */}
          <div className="mt-16 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/15 via-card to-background border border-primary/20 shadow-sm text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Ready to create your channel identity?
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
              ChannelForge AI turns any YouTube concept into channel names, banners, 4K logos, and content roadmaps in 30 seconds.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild size="lg" className="rounded-2xl px-6 font-semibold shadow-md">
                <Link href="/generate">
                  Generate Your Channel Brand <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl px-6 font-semibold">
                <Link href="/">Try Sample Prompts</Link>
              </Button>
            </div>
          </div>

          {/* Related Articles Footer */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border/70 space-y-6">
              <h2 className="text-xl font-bold text-foreground">
                More Guides from the Creator Hub
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.map((rel) => (
                  <div
                    key={rel.slug}
                    className="p-6 rounded-2xl bg-card border border-border/70 shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2.5">
                        <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5">
                          {rel.category}
                        </Badge>
                        <span>{rel.readTime}</span>
                      </div>
                      <h3 className="font-bold text-base text-foreground mb-2 hover:text-primary transition-colors">
                        <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="pt-4 mt-2 border-t border-border/50">
                      <Button variant="ghost" size="sm" className="p-0 h-auto font-semibold text-xs text-primary" asChild>
                        <Link href={`/blog/${rel.slug}`} className="flex items-center">
                          Read article <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
