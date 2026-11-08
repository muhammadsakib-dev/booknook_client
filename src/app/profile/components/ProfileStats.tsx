// Ready
"use client";

import { BookCheck, BookOpen, Clock, Library } from "lucide-react";

interface ProfileStatsProps {
  activeCount: number;
  totalBorrowedCount: number;
  completedCount: number;
  contributionsCount: number;
  isLoading: boolean;
}

export function ProfileStats({
  activeCount,
  totalBorrowedCount,
  completedCount,
  contributionsCount,
  isLoading,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* কার্ড ১: সক্রিয় ধার করা বই */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Loans
          </span>
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
            <Clock className="w-4 h-4" />
          </span>
        </div>
        <div>
          <span className="text-3xl font-extrabold text-foreground">
            {isLoading ? "..." : activeCount}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            Books currently borrowed
          </p>
        </div>
      </div>

      {/* কার্ড ২: সর্বমোট ধার করা বই */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Borrowed
          </span>
          <span className="p-2 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-4 h-4" />
          </span>
        </div>
        <div>
          <span className="text-3xl font-extrabold text-foreground">
            {isLoading ? "..." : totalBorrowedCount}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            All-time reading history
          </p>
        </div>
      </div>

      {/* কার্ড ৩: ফেরত দেওয়া বই */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Completed
          </span>
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
            <BookCheck className="w-4 h-4" />
          </span>
        </div>
        <div>
          <span className="text-3xl font-extrabold text-foreground">
            {isLoading ? "..." : completedCount}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            Returned in good condition
          </p>
        </div>
      </div>

      {/* কার্ড ৪: কন্ট্রিবিউট করা বই */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            My Contributions
          </span>
          <span className="p-2 rounded-xl bg-primary/10 text-primary">
            <Library className="w-4 h-4" />
          </span>
        </div>
        <div>
          <span className="text-3xl font-extrabold text-foreground">
            {isLoading ? "..." : contributionsCount}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            Books shared with readers
          </p>
        </div>
      </div>
    </div>
  );
}
