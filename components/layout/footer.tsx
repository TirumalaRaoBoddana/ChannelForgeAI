import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-[1440px]">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">ChannelForge AI</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Turn your YouTube idea into a complete channel brand in minutes. Build your audience faster with AI-powered strategy.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#demo" className="hover:text-foreground transition-colors">Interactive Demo</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="#blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="#terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link href="#cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ChannelForge AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
