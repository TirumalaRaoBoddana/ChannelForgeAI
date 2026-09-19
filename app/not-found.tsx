<<<<<<< HEAD
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
=======
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Sparkles, BookOpen, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>

      <div className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
        404 &bull; Page Not Found
      </div>

      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
        Lost in the Algorithm?
      </h1>

      <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-8 leading-relaxed">
        The page you are looking for doesn't exist or has been moved. Explore our creator tools and guides below.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" className="rounded-2xl px-6">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" /> Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-2xl px-6">
          <Link href="/generate">
            <Sparkles className="w-4 h-4 mr-2 text-primary" /> Launch Studio
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="rounded-2xl px-6">
          <Link href="/blog">
            <BookOpen className="w-4 h-4 mr-2" /> Creator Guides
          </Link>
        </Button>
      </div>
    </div>
  );
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
}
