// Complete the MyBorrowsPage component

"use client";

import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { getBorrows } from "@/services/read/getBorrows";
import { rejectBorrow, requestReturn } from "@/services/update/borrowApproval";
import type { BorrowRecord } from "@/types/book";

const DEFAULT_BOOK_COVER =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

function BorrowBookThumbnail({
  src,
  alt,
}: {
  src?: string | null;
  alt: string;
}) {
  const initial =
    src && typeof src === "string" && src.trim() !== ""
      ? src.trim()
      : DEFAULT_BOOK_COVER;
  const [imgSrc, setImgSrc] = useState(initial);

  useEffect(() => {
    if (src && typeof src === "string" && src.trim() !== "") {
      setImgSrc(src.trim());
    }
  }, [src]);

  return (
    <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/60 shadow-2xs relative aspect-[3/4]">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 48px, 56px"
        unoptimized
        onError={() => setImgSrc(DEFAULT_BOOK_COVER)}
        className="object-cover"
      />
    </div>
  );
}

export default function MyBorrowsPage() {
  useEffect(() => {
    document.title = "BookNook | My Borrows";
  }, []);

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "active" | "return-pending" | "returned"
  >("all");
  const [actionId, setActionId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // ধার করা বই তালিকা লোড করা
  const loadBorrows = async () => {
    setLoading(true);
    try {
      const data = await getBorrows();
      setBorrows(data);
    } catch (e) {
      console.error("Failed to load borrows:", e);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load borrows on mount
  useEffect(() => {
    loadBorrows();
    window.addEventListener("booknook:inventory-updated", loadBorrows);
    return () => {
      window.removeEventListener("booknook:inventory-updated", loadBorrows);
    };
  }, []);

  // বই ফেরত নেওয়ার জন্য রিকোয়েস্ট সাবমিট করা
  const handleRequestReturn = async (id: string) => {
    if (actionId) return;
    setActionId(id);

    const res = await requestReturn(id);
    setActionId(null);

    if (res.success) {
      showToast(
        "Return submitted! Waiting for the book contributor to confirm receipt.",
      );
      setBorrows((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: "Return Pending",
                returnRequestedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    } else {
      showToast(res.message || "Failed to submit return request.");
    }
  };

  // পেন্ডিং রিকোয়েস্ট বাতিল করা
  const handleCancelRequest = async (id: string) => {
    if (actionId) return;
    setActionId(id);

    const res = await rejectBorrow(id, "Cancelled by borrower");
    setActionId(null);

    if (res.success) {
      showToast("Borrow request cancelled. The reserved copy has been freed.");
      setBorrows((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: "Cancelled",
                rejectionReason: "Cancelled by you",
              }
            : item,
        ),
      );
    } else {
      showToast(res.message || "Failed to cancel request.");
    }
  };

  // ফিল্টারিং
  const filtered = borrows.filter((b) => {
    const matchesSearch =
      b.bookTitle?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookAuthor?.toLowerCase().includes(search.toLowerCase()) ||
      b.ownerName?.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "pending") {
      matchesStatus = b.status === "Pending";
    } else if (statusFilter === "active") {
      matchesStatus = b.status === "Active" || b.status === "Overdue";
    } else if (statusFilter === "return-pending") {
      matchesStatus = b.status === "Return Pending";
    } else if (statusFilter === "returned") {
      matchesStatus = b.status === "Returned";
    }

    return matchesSearch && matchesStatus;
  });

  const pendingCount = borrows.filter((b) => b.status === "Pending").length;
  const activeCount = borrows.filter(
    (b) => b.status === "Active" || b.status === "Overdue",
  ).length;
  const returnPendingCount = borrows.filter(
    (b) => b.status === "Return Pending",
  ).length;
  const returnedCount = borrows.filter((b) => b.status === "Returned").length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* টোস্ট নোটিফিকেশন */}
          {toastMsg && (
            <div className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
              <Check className="w-4 h-4" />
              <span>{toastMsg}</span>
            </div>
          )}

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
            <span className="text-foreground font-medium">
              My Borrowed Books
            </span>
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
                <p className="text-lg font-bold text-amber-500">
                  {pendingCount}
                </p>
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

          {/* 3. সার্চ ও ফিল্টার বার */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, author, or contributor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-card border border-border rounded-xl">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({borrows.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === "pending"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === "active"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("return-pending")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === "return-pending"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Return Pending ({returnPendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("returned")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === "returned"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Returned ({returnedCount})
              </button>
            </div>
          </div>

          {/* 4. ধারের তালিকা */}
          {loading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading your borrow records...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground mb-1">
                No Loans Found
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {search
                  ? "No borrowed books match your search."
                  : "You have no active or past book loans in this category."}
              </p>
              <Link
                href="/books"
                className={buttonVariants({
                  size: "sm",
                  className: "bg-primary text-primary-foreground",
                })}
              >
                Find Books to Borrow
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider">
                      <th className="py-3 px-4">Book & Contributor</th>
                      <th className="py-3 px-4">Requested / Borrowed</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((item) => {
                      const isPending = item.status === "Pending";
                      const isActive = item.status === "Active";
                      const isReturnPending = item.status === "Return Pending";
                      const isReturned = item.status === "Returned";
                      const isOverdue = item.status === "Overdue";
                      const isRejected =
                        item.status === "Rejected" ||
                        item.status === "Cancelled";

                      const rawImage =
                        item.bookImage ||
                        (item as { image?: string }).image ||
                        (item as { coverImage?: string }).coverImage ||
                        (item as { imageUrl?: string }).imageUrl ||
                        (item as { cover_image?: string }).cover_image;
                      const bookTitle = item.bookTitle || "Borrowed Book";

                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          {/* Book & Contributor */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3.5 min-w-[240px]">
                              <BorrowBookThumbnail
                                src={rawImage}
                                alt={bookTitle}
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-foreground line-clamp-1">
                                  {bookTitle}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.bookAuthor || "Unknown Author"} •{" "}
                                  {item.quantity}{" "}
                                  {item.quantity === 1 ? "Copy" : "Copies"}
                                </p>
                                {item.ownerName && (
                                  <p className="text-[11px] text-primary/80 mt-1 flex items-center gap-1 font-medium">
                                    <User className="w-3 h-3 shrink-0" />
                                    <span>Contributor: {item.ownerName}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Date Info */}
                          <td className="py-3 px-4 text-muted-foreground">
                            {isPending ? (
                              <div>
                                <span className="font-medium text-foreground">
                                  {item.requestedAt
                                    ? new Date(
                                        item.requestedAt,
                                      ).toLocaleDateString()
                                    : "Recently"}
                                </span>
                                <p className="text-[10px] text-muted-foreground">
                                  Requested
                                </p>
                              </div>
                            ) : item.borrowedAt ? (
                              <div>
                                <span className="font-medium text-foreground">
                                  {new Date(
                                    item.borrowedAt,
                                  ).toLocaleDateString()}
                                </span>
                                <p className="text-[10px] text-muted-foreground">
                                  Approved & Issued
                                </p>
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </td>

                          {/* Due Date */}
                          <td className="py-3 px-4">
                            {isPending ? (
                              <span className="text-muted-foreground italic">
                                Pending approval
                              </span>
                            ) : item.dueDate ? (
                              <div className="flex items-center gap-1 font-medium">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span
                                  className={
                                    isOverdue
                                      ? "text-destructive font-bold"
                                      : ""
                                  }
                                >
                                  {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4">
                            {isPending && (
                              <Badge
                                variant="outline"
                                className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-semibold"
                              >
                                Pending Approval
                              </Badge>
                            )}
                            {isActive && (
                              <Badge
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold"
                              >
                                Active Loan
                              </Badge>
                            )}
                            {isReturnPending && (
                              <Badge
                                variant="outline"
                                className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] font-semibold"
                              >
                                Return Pending
                              </Badge>
                            )}
                            {isReturned && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] font-medium"
                              >
                                Returned
                              </Badge>
                            )}
                            {isOverdue && (
                              <Badge
                                variant="destructive"
                                className="text-[10px] font-semibold"
                              >
                                Overdue
                              </Badge>
                            )}
                            {isRejected && (
                              <Badge
                                variant="outline"
                                className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] font-medium"
                              >
                                {item.status}
                              </Badge>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-3 px-4 text-right">
                            {isPending && (
                              <Button
                                size="sm"
                                disabled={actionId === item._id}
                                onClick={() => handleCancelRequest(item._id)}
                                variant="outline"
                                className="h-8 text-xs border-border hover:border-destructive hover:text-destructive font-semibold cursor-pointer"
                              >
                                {actionId === item._id ? (
                                  <span>Cancelling...</span>
                                ) : (
                                  <span className="flex items-center gap-1.5">
                                    <XCircle className="w-3.5 h-3.5" />
                                    Cancel Request
                                  </span>
                                )}
                              </Button>
                            )}

                            {isActive && (
                              <Button
                                size="sm"
                                disabled={actionId === item._id}
                                onClick={() => handleRequestReturn(item._id)}
                                variant="outline"
                                className="h-8 text-xs border-border hover:bg-muted font-semibold cursor-pointer"
                              >
                                {actionId === item._id ? (
                                  <span>Submitting...</span>
                                ) : (
                                  <span className="flex items-center gap-1.5">
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Return Book
                                  </span>
                                )}
                              </Button>
                            )}

                            {isReturnPending && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                <Clock className="w-3.5 h-3.5 animate-pulse" />
                                <span>Awaiting Contributor</span>
                              </span>
                            )}

                            {isReturned && (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Completed
                              </span>
                            )}

                            {isRejected && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>{item.rejectionReason || "Closed"}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
