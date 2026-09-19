<<<<<<< HEAD
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { auth } from "@/auth";
import "./globals.css";

=======
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/firebase/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
export const metadata: Metadata = {
  title: "ChannelForge AI",
  description: "Turn your YouTube idea into a complete channel brand in minutes.",
};

<<<<<<< HEAD
export default async function RootLayout({
=======
export default function RootLayout({
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.warn("Auth initialization failed (likely during build):", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar session={session} />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
=======
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
      </body>
    </html>
  );
}
