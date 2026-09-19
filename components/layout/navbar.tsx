"use client";

<<<<<<< HEAD
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Sun, User as UserIcon, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import { handleSignOut } from "@/lib/actions/auth";

export function Navbar({ session }: { session: Session | null }) {
  const { setTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between max-w-[1440px]">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">ChannelForge AI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Product</Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link href="#blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
        </nav>
        
        <div className="flex items-center gap-4">
=======
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/lib/firebase/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Moon,
  Sun,
  User as UserIcon,
  LogOut,
  Menu,
  LayoutDashboard,
  FolderKanban,
  Settings as SettingsIcon,
  UserCircle,
  Wand2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/product", label: "Product" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || null;
  const userEmail = profile?.email || user?.email || null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between max-w-[1440px]">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
          <span className="font-bold text-base sm:text-lg tracking-tight">ChannelForge AI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                pathname.startsWith(link.href) ? "text-foreground font-semibold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/generate"
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname === "/generate" ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-primary" />
            Studio
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

<<<<<<< HEAD
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                    {session.user?.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>}
=======
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-primary/20">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {displayName && <p className="font-semibold text-sm">{displayName}</p>}
                    {userEmail && (
                      <p className="w-[180px] truncate text-xs text-muted-foreground">
                        {userEmail}
                      </p>
                    )}
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
<<<<<<< HEAD
                  <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onSelect={() => {
                  const form = document.createElement("form");
                  form.action = handleSignOut as any;
                  document.body.appendChild(form);
                  form.submit();
                }}>
=======
                  <Link href="/dashboard" className="cursor-pointer flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/projects" className="cursor-pointer flex items-center">
                    <FolderKanban className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Your Projects</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer flex items-center">
                    <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Account & Billing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center">
                    <SettingsIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive flex items-center"
                  onSelect={handleLogout}
                >
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
<<<<<<< HEAD
              <Button asChild variant="ghost">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full px-6">
=======
              <Button asChild variant="ghost" className="text-sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full px-5 text-sm shadow-sm">
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}
<<<<<<< HEAD
=======

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] overflow-y-auto max-h-screen flex flex-col p-6">
              <SheetHeader className="text-left pb-2">
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  ChannelForge AI
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-2 flex-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`min-h-[44px] flex items-center px-3 rounded-xl text-base font-medium transition-colors hover:text-foreground hover:bg-muted/50 ${
                      pathname.startsWith(link.href) ? "text-foreground font-semibold bg-muted/30" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/generate"
                  onClick={() => setMobileOpen(false)}
                  className={`min-h-[44px] flex items-center px-3 rounded-xl text-base font-medium gap-2 transition-colors hover:bg-primary/10 ${
                    pathname === "/generate" ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Wand2 className="w-4 h-4 text-primary" />
                  Creator Studio
                </Link>

                {user ? (
                  <div className="flex flex-col gap-1 mt-4 pt-4 border-t space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1">
                      Account & Workspaces
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="min-h-[44px] flex items-center px-3 rounded-xl text-sm font-medium gap-2 text-foreground hover:bg-muted/50 hover:text-primary"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Dashboard
                    </Link>
                    <Link
                      href="/projects"
                      onClick={() => setMobileOpen(false)}
                      className="min-h-[44px] flex items-center px-3 rounded-xl text-sm font-medium gap-2 text-foreground hover:bg-muted/50 hover:text-primary"
                    >
                      <FolderKanban className="w-4 h-4 text-muted-foreground" /> Your Projects
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="min-h-[44px] flex items-center px-3 rounded-xl text-sm font-medium gap-2 text-foreground hover:bg-muted/50 hover:text-primary"
                    >
                      <UserCircle className="w-4 h-4 text-muted-foreground" /> Account & Billing
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="min-h-[44px] flex items-center px-3 rounded-xl text-sm font-medium gap-2 text-foreground hover:bg-muted/50 hover:text-primary"
                    >
                      <SettingsIcon className="w-4 h-4 text-muted-foreground" /> Settings
                    </Link>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full min-h-[44px] justify-start text-destructive hover:text-destructive rounded-xl"
                        onClick={async () => {
                          setMobileOpen(false);
                          await handleLogout();
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Log out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-6 pt-4 border-t">
                    <Button asChild variant="outline" className="w-full min-h-[44px] justify-start rounded-xl text-sm font-semibold" onClick={() => setMobileOpen(false)}>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full min-h-[44px] justify-start rounded-xl text-sm font-semibold shadow-sm" onClick={() => setMobileOpen(false)}>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
        </div>
      </div>
    </header>
  );
}
