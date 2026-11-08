// Ready
"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

interface BorrowsHeaderProps {
  activeCount: number;
  pendingCount: number;
  returnedCount: number;
}

export function BorrowsHeader({
  activeCount,
  pendingCount,
  returnedCount,
}: BorrowsHeaderProps) {
  return (
    <>
      {/* 1. ব্রেডক্রাম্ব */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link
          href="/"
          className="hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">My Borrowed Books</span>
      </div>

      {/* 2. হেডার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Reading Activity
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            My Book Loans & Requests
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your requested, active, and returned books.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-card border border-border text-center shadow-2xs">
            <p className="text-lg font-bold text-primary">{activeCount}</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              Active Loans
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-card border border-border text-center shadow-2xs">
            <p className="text-lg font-bold text-amber-500">{pendingCount}</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              Pending
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-card border border-border text-center shadow-2xs">
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {returnedCount}
            </p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              Returned
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
