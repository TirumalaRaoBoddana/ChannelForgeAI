import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - ChannelForge AI",
  description: "Learn about ChannelForge AI, our mission, and how we help YouTube creators.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-foreground text-center">
            About ChannelForge AI
          </h1>
          
          <div className="prose prose-zinc dark:prose-invert mx-auto text-lg leading-relaxed">
            <p>
              Starting a YouTube channel is harder than ever. Not only do you have to create compelling content, but you also have to act as a brand strategist, graphic designer, and SEO expert just to get your channel off the ground.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-6">Our Mission</h2>
            <p>
              At ChannelForge AI, our mission is to remove the friction of starting a new YouTube channel. We believe that creative potential shouldn't be blocked by the technical hurdles of branding and positioning.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-6">Who It's For</h2>
            <p>
              ChannelForge is designed for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 mb-8">
              <li><strong>New Creators</strong> who have an idea but don't know how to package it visually.</li>
              <li><strong>Faceless Channel Operators</strong> launching multiple properties who need quick, professional branding.</li>
              <li><strong>Experienced YouTubers</strong> pivoting to a new niche who want a data-backed starting point.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">Our Philosophy</h2>
            <p>
              We believe AI should be a tool for empowerment, not a replacement for human creativity. ChannelForge provides the scaffolding—the names, the visual identity, the structural content pillars—so that you can focus on what actually matters: recording great videos and building a connection with your audience.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
