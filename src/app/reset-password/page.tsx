// Complete the ResetPasswordPage component

"use client";

import { AlertCircle, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/header/Logo";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/auth-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // পাসওয়ার্ড ভ্যালিডেশন
    if (!token) {
      setErrorMsg("Missing or invalid reset token. Please request a new link.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      setErrorMsg(
        "Password must contain at least one uppercase and one lowercase letter.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({
        newPassword,
        token,
      });

      if (res?.error) {
        setErrorMsg(
          res.error.message ||
            "Failed to reset password. The token may be expired.",
        );
        setLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "An error occurred while resetting password.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-4">
        <Logo size="lg" className="mx-auto mb-2" />
        <h2 className="text-xl font-bold text-foreground">
          Invalid Reset Link
        </h2>
        <p className="text-xs text-muted-foreground">
          No valid reset token was detected in your request URL. Please submit a
          new password reset request.
        </p>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg">
      <div className="flex flex-col items-center text-center mb-8">
        <Logo size="lg" className="mb-4" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Set New Password
        </h1>
        <p className="text-xs text-muted-foreground mt-1.5">
          Enter and confirm your new secure password for your BookNook account
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-foreground">
            Password Reset Successful!
          </h3>
          <p className="text-xs text-muted-foreground">
            Your password has been securely updated. Redirecting to sign in...
          </p>
          <div className="pt-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="newPassword"
              className="block text-xs font-semibold text-foreground"
            >
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-foreground"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Must be at least 6 characters with uppercase and lowercase letters.
          </p>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm cursor-pointer mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Updating Password...
              </span>
            ) : (
              <span>Reset Password</span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
