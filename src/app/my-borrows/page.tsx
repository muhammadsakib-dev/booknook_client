// Complete the MyBorrowsPage component

"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
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
import { returnBorrow } from "@/services/delete/returnBorrow";
import { getBorrows } from "@/services/read/getBorrows";
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
    "all" | "active" | "returned"
  >("all");
  const [returningId, setReturningId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
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
  }, []);

  // বই ফেরত দেওয়া
  const handleReturn = async (id: string) => {
    if (returningId) return;
    setReturningId(id);

    const res = await returnBorrow(id);
    setReturningId(null);

    if (res.success) {
      showToast("Book returned successfully! Thank you for reading.");
      setBorrows((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: "Returned",
                returnedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    } else {
      showToast(res.message || "Failed to return book.");
    }
  };

  // ফিল্টারিং
  const filtered = borrows.filter((b) => {
    const matchesSearch =
      b.bookTitle?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookAuthor?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? b.status === "Active" || b.status === "Overdue"
          : b.status === "Returned";

    return matchesSearch && matchesStatus;
  });

  const activeCount = borrows.filter(
    (b) => b.status === "Active" || b.status === "Overdue",
  ).length;
  const returnedCount = borrows.filter((b) => b.status === "Returned").length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* টোস্ট নোটিফিকেশন */}
          {toastMsg && (
            <div className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold">
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
            <span className="text-foreground font-medium">My Borrows</span>
          </div>

          {/* 2. হেডার ব্যানার */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reader Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                My Borrowed Books
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Track your active physical loans, view due dates, and return
                books when done.
              </p>
            </div>

            <Link
              href="/books"
              className={buttonVariants({
                size: "sm",
                className: "bg-primary text-primary-foreground",
              })}
            >
              Browse Catalog
            </Link>
          </div>

          {/* 3. সার্চ ও স্ট্যাটাস ফিল্টার বার */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search borrowed books..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-1.5">
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
                      <th className="py-3 px-4">Book</th>
                      <th className="py-3 px-4">Borrowed On</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((item) => {
                      const isReturned = item.status === "Returned";
                      const isOverdue = item.status === "Overdue";
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
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3.5 min-w-[220px]">
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
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(item.borrowedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                              <span
                                className={
                                  isOverdue ? "text-destructive font-bold" : ""
                                }
                              >
                                {new Date(item.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                isReturned
                                  ? "secondary"
                                  : isOverdue
                                    ? "destructive"
                                    : "default"
                              }
                              className="text-[10px]"
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {isReturned ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Returned
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                disabled={returningId === item._id}
                                onClick={() => handleReturn(item._id)}
                                className="h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                {returningId === item._id
                                  ? "Returning..."
                                  : "Return Book"}
                              </Button>
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
