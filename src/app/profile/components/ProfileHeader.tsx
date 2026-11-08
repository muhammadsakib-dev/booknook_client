// Ready
"use client";

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  IdCard,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

export interface ProfileUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  createdAt?: string | Date | null;
}

interface ProfileHeaderProps {
  user?: ProfileUser | null;
  onSignOut: () => Promise<void>;
}

export function ProfileHeader({ user, onSignOut }: ProfileHeaderProps) {
  const [errorSrc, setErrorSrc] = useState<string | null>(null);

  const rawAvatarUrl =
    user?.image ||
    (user?.email
      ? `https://unavatar.io/${encodeURIComponent(user.email)}`
      : null);

  const avatarUrl = errorSrc === rawAvatarUrl ? null : rawAvatarUrl;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "2026";

  return (
    <>
      {/* টপ ন্যাভিগেশন বার */}
      <div className="flex items-center justify-between">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Browse Books</span>
        </Link>

        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Reader Account Overview
        </span>
      </div>

      {/* প্রোফাইল হেডার কার্ড */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* বড় ইউজার অ্যাভাটার (ছবি থাকলে ছবি, নয়তো নামের প্রথম অক্ষর) */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-primary text-primary-foreground text-3xl sm:text-4xl font-extrabold flex items-center justify-center shadow-md overflow-hidden relative">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={user?.name || "User Avatar"}
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  unoptimized
                  onError={() => setErrorSrc(rawAvatarUrl)}
                  className="object-cover"
                />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || "R"}</span>
              )}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 p-1 bg-emerald-500 text-white rounded-full ring-4 ring-card">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          {/* ইউজার ডিটেইলস */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {user?.name || "Reader Account"}
              </h1>
              <Badge variant="secondary" className="font-semibold text-xs">
                Active Reader
              </Badge>
              <Badge
                variant="outline"
                className="text-xs font-medium flex items-center gap-1 text-primary border-primary/30"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Member
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email || "reader@booknook.lib"}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Member since {joinedDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IdCard className="w-3.5 h-3.5 text-primary" />
                Reader ID:{" "}
                <code className="text-foreground font-mono">
                  {user?.id?.slice(-8) || "standard"}
                </code>
              </span>
            </div>
          </div>

          {/* হেডার অ্যাকশন বাটন */}
          <div className="flex flex-row sm:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/my-borrows"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className:
                  "w-full justify-center gap-2 rounded-xl text-xs font-semibold",
              })}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Borrow Bag</span>
            </Link>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className="w-full justify-center gap-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive border-border cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
