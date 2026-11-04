// Complete the ForgotPasswordPage component

"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/header/Logo";
import { Button } from "@/components/ui/button";
import { forgetPassword } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  useEffect(() => {
    document.title = "BookNook | Forgot Password";
  }, []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const res = await forgetPassword({
        email: trimmedEmail,
        redirectTo: "/reset-password",
      });

      if (res?.error) {
        setErrorMsg(
          res.error.message || "Failed to process request. Please try again.",
        );
        setLoading(false);
        return;
      }

      // লোকাল/ডেমো টোকেন চেক (SMTP ছাড়া সরাসরি পরীক্ষার সুবিধার জন্য)
      try {
        const tokenRes = await fetch(
          `/api/auth/reset-token?email=${encodeURIComponent(trimmedEmail)}`,
        );
        const tokenData = await tokenRes.json();
        if (tokenData?.token) {
          setResetToken(tokenData.token);
        }
      } catch (e) {
        console.error("Token fetch err:", e);
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg">
        {/* লোগো ও হেডার */}
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Forgot Password?
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
            Enter your registered email address and we will help you reset your
            library account password.
          </p>
        </div>

        {/* এরর মেসেজ */}
        {errorMsg && (
          <div className="p-3.5 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* সাকসেস স্টেট */}
        {isSuccess ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Reset Link Generated!
                </p>
                <p className="text-muted-foreground mt-1">
                  If an account exists with{" "}
                  <strong className="text-foreground">{email}</strong>, a
                  password reset request has been processed.
                </p>
              </div>
            </div>

            {/* সরাসরি টেস্ট ও পাসওয়ার্ড সেট বাটন */}
            {resetToken && (
              <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                  <KeyRound className="w-4 h-4" />
                  <span>Instant Reset Available</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  You can proceed directly to create a new password for your
                  account now:
                </p>
                <Link
                  href={`/reset-password?token=${resetToken}`}
                  className="w-full h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs flex items-center justify-center transition-colors"
                >
                  Set New Password Now
                </Link>
              </div>
            )}

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          /* পাসওয়ার্ড রিসেট ইমেইল ফর্ম */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-foreground"
              >
                Account Email Address
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span>Send Reset Link</span>
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
