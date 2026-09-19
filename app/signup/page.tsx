"use client";

<<<<<<< HEAD
import { useActionState } from "react";
import { signup, handleGoogleSignIn } from "@/lib/actions/auth";
=======
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
<<<<<<< HEAD
import { AlertCircle, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    signup,
    undefined,
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
=======
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ email: string } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setIsPending(false);
      return;
    }

    try {
      await signUpWithEmail(email.trim(), password, name.trim());
      // Show verification notice as specified in Signup flow
      setSuccessInfo({ email: email.trim() });
    } catch (err: any) {
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        setErrorMessage("An account with this email already exists.");
      } else if (code === "auth/weak-password") {
        setErrorMessage("Password should be at least 6 characters.");
      } else if (code === "auth/invalid-email") {
        setErrorMessage("Please provide a valid email address.");
      } else {
        setErrorMessage(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGooglePending(true);
    setErrorMessage(null);

    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setErrorMessage(err.message || "Google registration failed. Please try again.");
      }
      setIsGooglePending(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
<<<<<<< HEAD
            Enter your email and a password to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </div>
            )}
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <form action={handleGoogleSignIn}>
            <Button variant="outline" className="w-full" type="submit">
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Google
            </Button>
          </form>
=======
            Enter your details below to start forging your YouTube channel brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successInfo ? (
            <div className="space-y-5 py-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold">Verification email dispatched!</p>
                  <p className="text-xs text-muted-foreground">
                    We sent a confirmation link to <strong className="text-foreground">{successInfo.email}</strong>. Check your inbox and spam folder to verify your account.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Proceed to Dashboard</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setSuccessInfo(null)}>
                  Register another account
                </Button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <Button className="w-full" type="submit" disabled={isPending || isGooglePending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isPending || isGooglePending}
              >
                {isGooglePending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                )}
                Google
              </Button>
            </>
          )}
>>>>>>> d3bafc2 (User Login,SignUp,Authentication added)
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
