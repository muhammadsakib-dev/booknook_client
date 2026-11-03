// Complete the LoginPage component

"use client";

import { AlertCircle, ArrowLeft, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/header/Logo";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        setErrorMsg(res.error.message || "Invalid email or password.");
      } else {
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await signIn.social({
        provider: "google",
        callbackURL: redirectUrl,
      });

      if (res?.error) {
        setErrorMsg(
          res.error.message ||
            "Google Sign-In is not configured. Please ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in your environment variables.",
        );
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Google Sign-In is not currently available.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg">
      <div className="flex flex-col items-center text-center mb-8">
        <Logo size="lg" className="mb-4" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome Back to BookNook
        </h1>
        <p className="text-xs text-muted-foreground mt-1.5">
          Sign in to access your borrowed books and library dashboard
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-11 border-border hover:bg-muted font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 mb-6 cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
          />
        </svg>
        <span>Continue with Google</span>
      </Button>

      <div className="relative flex items-center gap-3 mb-6">
        <span className="flex-1 h-px bg-border" />

        <span className="shrink-0 bg-card px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Or with Email
        </span>

        <span className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-foreground"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reader@booknook.com"
              required
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-foreground"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm cursor-pointer mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </span>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
          className="text-primary font-semibold hover:underline"
        >
          Register for free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md mx-auto w-full mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto bg-card border border-border rounded-3xl p-10 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
