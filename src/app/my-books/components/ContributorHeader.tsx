// Ready
"use client";

import {
  ArrowLeft,
  BookOpen,
  Inbox,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

interface ContributorHeaderProps {
  activeTab: "catalog" | "requests";
  onTabChange: (tab: "catalog" | "requests") => void;
  totalBooks: number;
  totalRequests: number;
  totalActionNeeded: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export function ContributorHeader({
  activeTab,
  onTabChange,
  totalBooks,
  totalRequests,
  totalActionNeeded,
  onRefresh,
  isLoading,
}: ContributorHeaderProps) {
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
        <span className="text-foreground font-medium">Contributor Hub</span>
      </div>

      {/* 2. হেডার ব্যানার */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Contributor Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Manage Books & Borrow Requests
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Monitor your registered titles, approve incoming reader requests,
            and confirm returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1.5 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Link
            href="/add-book"
            className={buttonVariants({
              size: "sm",
              className: "bg-primary text-primary-foreground gap-1.5",
            })}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Book
          </Link>
        </div>
      </div>

      {/* 3. প্রাইমারি ট্যাব নেভিগেশন (Catalog vs Requests) */}
      <div className="flex items-center gap-3 border-b border-border mb-8">
        <button
          type="button"
          onClick={() => onTabChange("catalog")}
          className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "catalog"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Uploaded Catalog</span>
          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
            {totalBooks}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("requests")}
          className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "requests"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Borrow Requests</span>
          {totalActionNeeded > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold animate-pulse">
              {totalActionNeeded} Pending
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
              {totalRequests}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
