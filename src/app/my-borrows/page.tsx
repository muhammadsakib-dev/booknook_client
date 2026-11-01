"use client";

import { cn } from "cn";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  fetchBorrows,
  notifyInventoryUpdated,
  returnBorrowedBook,
} from "@/lib/books";
import type { BorrowRecord } from "@/types/book";

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "returned" | "overdue"
  >("all");

  // Returning state
  const [returningId, setReturningId] = useState<string | null>(null);
  const [isProcessingReturn, setIsProcessingReturn] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchBorrows();
      setBorrows(data);
    } catch (e) {
      console.error("Failed to load borrows:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchBorrows()
      .then((data) => {
        if (active) setBorrows(data);
      })
      .catch((e) => console.error("Failed to load borrows:", e))
      .finally(() => {
        if (active) setLoading(false);
      });

    const handleInventoryUpdate = () => {
      fetchBorrows()
        .then((data) => {
          if (active) setBorrows(data);
        })
        .catch((e) => console.error("Failed to revalidate borrows:", e));
    };

    window.addEventListener(
      "booknook:inventory-updated",
      handleInventoryUpdate,
    );
    return () => {
      active = false;
      window.removeEventListener(
        "booknook:inventory-updated",
        handleInventoryUpdate,
      );
    };
  }, []);

  // Compute status & 14-day calendar countdown
  const getRecordStatus = (r: BorrowRecord) => {
    if (r.status === "Returned") {
      return {
        status: "Returned" as const,
        daysRemaining: 0,
        isOverdue: false,
        isDueToday: false,
        label: "Returned",
      };
    }

    const now = new Date();
    const due = new Date(r.dueDate);

    // Compare calendar days normalized to midnight
    const msPerDay = 1000 * 60 * 60 * 24;
    const todayZero = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const dueZero = new Date(
      due.getFullYear(),
      due.getMonth(),
      due.getDate(),
    ).getTime();
    const daysRemaining = Math.round((dueZero - todayZero) / msPerDay);

    const isOverdue = daysRemaining < 0;
    const isDueToday = daysRemaining === 0;

    let label = "Active Loan";
    if (isOverdue) label = "Overdue";
    else if (isDueToday) label = "Due Today";

    return {
      status: isOverdue
        ? ("Overdue" as const)
        : isDueToday
          ? ("Due Today" as const)
          : ("Active" as const),
      daysRemaining,
      isOverdue,
      isDueToday,
      label,
    };
  };

  // Metrics (Phase 07: An overdue loan remains an active loan until returned)
  const totalCount = borrows.length;
  const returnedCount = borrows.filter((b) => b.status === "Returned").length;
  // All active (unreturned) loans
  const activeCount = borrows.filter((b) => b.status !== "Returned").length;
  // Overdue loans among unreturned
  const overdueCount = borrows.filter(
    (b) => b.status !== "Returned" && getRecordStatus(b).isOverdue,
  ).length;

  // Filtered list
  const filtered = borrows.filter((r) => {
    const meta = getRecordStatus(r);
    const isUnreturned = r.status !== "Returned";

    let matchesTab = true;
    if (activeTab === "active") {
      matchesTab = isUnreturned; // All active loans, including overdue
    } else if (activeTab === "overdue") {
      matchesTab = isUnreturned && meta.isOverdue;
    } else if (activeTab === "returned") {
      matchesTab = r.status === "Returned";
    }

    const matchesSearch =
      r.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleReturn = async (id: string) => {
    if (isProcessingReturn) return; // Prevent double submission
    setIsProcessingReturn(true);

    const res = await returnBorrowedBook(id);
    setIsProcessingReturn(false);
    setReturningId(null);

    if (res.success) {
      showToast("Book returned successfully! Thank you for reading.");
      notifyInventoryUpdated();
      setBorrows((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: "Returned" as const,
                returnedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    } else {
      showToast(res.message || "Failed to process return.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toast */}
          {toastMsg && (
            <div className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-300">
              <Check className="w-4 h-4" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* 1. Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">My Borrows</span>
          </div>

          {/* 2. Header Banner */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reader Account</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
                My Borrowed <span className="text-primary">Books</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Track your borrowed titles, monitor 14-day loan return due
                dates, and return completed books to keep copies available for
                others.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-border hover:bg-muted h-11 px-4 cursor-pointer"
              >
                <RotateCcw
                  className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Link
                href="/books"
                className={cn(
                  buttonVariants(),
                  "bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-5 font-semibold cursor-pointer flex items-center gap-2",
                )}
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Catalog</span>
              </Link>
            </div>
          </div>

          {/* 3. Metrics Cards (Phase 07 Compliant) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Borrows
              </p>
              <p className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                {totalCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All-time loans
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Active Loans
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                {activeCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Currently with you
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-semibold text-destructive uppercase tracking-wider">
                Overdue
              </p>
              <p className="text-2xl sm:text-3xl font-black text-destructive mt-2">
                {overdueCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Needs immediate return
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Returned
              </p>
              <p className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                {returnedCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Completed reads
              </p>
            </div>
          </div>

          {/* 4. Filter Tabs & Search */}
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-8 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("active")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeTab === "active"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Active Loans ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("overdue")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeTab === "overdue"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Overdue ({overdueCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("returned")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeTab === "returned"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Returned ({returnedCount})
              </button>
            </div>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search borrowed titles..."
                className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* 5. Loans List / Cards */}
          {loading ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading your borrowed books...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                No Borrow Records
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || activeTab !== "all"
                  ? "No borrowed books match your current search/filter."
                  : "You have not borrowed any books yet. Borrow books from our catalog anytime for free!"}
              </p>
              <Link
                href="/books"
                className={cn(
                  buttonVariants(),
                  "bg-primary text-primary-foreground hover:bg-primary/90 mt-2",
                )}
              >
                Browse Available Books
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((record) => {
                const meta = getRecordStatus(record);
                const isOverdue = meta.isOverdue;
                const isDueToday = meta.isDueToday;
                const isReturned = record.status === "Returned";
                const daysLeft = meta.daysRemaining;

                const formattedBorrowedDate = new Date(
                  record.borrowedAt,
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                const formattedDueDate = new Date(
                  record.dueDate,
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                const formattedReturnedDate = record.returnedAt
                  ? new Date(record.returnedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : null;

                return (
                  <div
                    key={record._id}
                    className={`bg-card border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                      isOverdue
                        ? "border-destructive/60 bg-destructive/5 dark:bg-destructive/10"
                        : isReturned
                          ? "border-border/60 opacity-85"
                          : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Status & Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            isReturned
                              ? "bg-muted text-muted-foreground"
                              : isOverdue
                                ? "bg-destructive text-destructive-foreground animate-pulse"
                                : isDueToday
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {meta.label}
                        </Badge>

                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          {record.quantity}{" "}
                          {record.quantity === 1 ? "Copy" : "Copies"}
                        </span>
                      </div>

                      {/* Book Info Section */}
                      <div className="flex gap-4 items-start">
                        <div className="relative w-16 h-22 rounded-lg overflow-hidden bg-muted shrink-0 border border-border shadow-xs">
                          {record.bookImage ? (
                            <Image
                              src={record.bookImage}
                              alt={record.bookTitle}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                              <BookOpen className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-foreground text-base line-clamp-1">
                            {record.bookTitle}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            by {record.bookAuthor}
                          </p>

                          {/* Loan Timeline */}
                          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>Borrowed: {formattedBorrowedDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                              <Clock
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isOverdue
                                    ? "text-destructive"
                                    : isDueToday
                                      ? "text-amber-500"
                                      : "text-primary"
                                }`}
                              />
                              <span
                                className={
                                  isOverdue
                                    ? "text-destructive font-bold"
                                    : isDueToday
                                      ? "text-amber-600 dark:text-amber-400 font-bold"
                                      : "text-foreground"
                                }
                              >
                                Due: {formattedDueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status / Countdown Banner */}
                      {isReturned ? (
                        <div className="p-2.5 rounded-xl text-xs flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>
                            Returned successfully{" "}
                            {formattedReturnedDate
                              ? `on ${formattedReturnedDate}`
                              : ""}
                            . Copy returned to inventory.
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                            isOverdue
                              ? "bg-destructive/15 text-destructive border border-destructive/30 font-semibold"
                              : isDueToday
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold"
                                : daysLeft <= 3
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium"
                                  : "bg-muted/60 text-muted-foreground border border-border/50"
                          }`}
                        >
                          {isOverdue ? (
                            <>
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>
                                Overdue by {Math.abs(daysLeft)}{" "}
                                {Math.abs(daysLeft) === 1 ? "day" : "days"}!
                                Please return promptly.
                              </span>
                            </>
                          ) : isDueToday ? (
                            <>
                              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                              <span>
                                Due today! Please return by end of day.
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 shrink-0 text-primary" />
                              <span>
                                {daysLeft} {daysLeft === 1 ? "day" : "days"}{" "}
                                remaining on your 14-day loan
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions Bottom Bar */}
                    <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-2">
                      {record.bookId ? (
                        <Link
                          href={`/books/${record.bookId}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1",
                          )}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Book Details</span>
                        </Link>
                      ) : (
                        <span />
                      )}

                      {isReturned ? (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setReturningId(record._id)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1" />
                          Return Book
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 6. Return Confirmation Modal */}
          {returningId && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Return this Book to the Library?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Once returned, the book copies will be released back to the
                    library catalog and marked available for other readers to
                    borrow.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setReturningId(null)}
                    disabled={isProcessingReturn}
                    className="border-border hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleReturn(returningId)}
                    disabled={isProcessingReturn}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    {isProcessingReturn ? "Returning..." : "Confirm Return"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
