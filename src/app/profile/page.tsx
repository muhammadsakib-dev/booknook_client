// Complete the ProfilePage component

"use client";

import {
  ArrowLeft,
  BookCheck,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  IdCard,
  Library,
  LogOut,
  Mail,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { getBorrows } from "@/services/read/getBorrows";
import { getMyBooks } from "@/services/read/getMyBooks";
import type { Book, BorrowRecord } from "@/types/book";

const DEFAULT_BOOK_COVER =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

function ProfileBookThumbnail({
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
    <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/60 shadow-2xs relative aspect-[3/4]">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="48px"
        unoptimized
        onError={() => setImgSrc(DEFAULT_BOOK_COVER)}
        className="object-cover"
      />
    </div>
  );
}

function ProfileContent() {
  const { data: session } = useSession();

  useEffect(() => {
    document.title = "BookNook | My Profile";
  }, []);

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = session?.user;

  // লোড করুন ইউজারের ধার করা বই এবং কন্ট্রিবিউট করা বই
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      getBorrows(),
      user?.id ? getMyBooks(user.id) : Promise.resolve([]),
    ])
      .then(([borrowsData, booksData]) => {
        if (isMounted) {
          setBorrows(borrowsData || []);
          setMyBooks(booksData || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load profile data:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  // পরিসংখ্যন হিসাব
  const activeBorrows = borrows.filter((b) => b.status === "Active");
  const returnedBorrows = borrows.filter((b) => b.status === "Returned");

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "2026";

  return (
    <div className="w-full min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

        {/* ১. প্রোফাইল হেডার কার্ড */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* বড় ইউজার অ্যাভাটার */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-primary text-primary-foreground text-3xl sm:text-4xl font-extrabold flex items-center justify-center shadow-md">
                {user?.name?.charAt(0).toUpperCase() || "R"}
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
                onClick={handleLogout}
                className="w-full justify-center gap-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive border-border cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ২. রিডার স্ট্যাটিস্টিক্স গ্রিড */}
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
                {isLoading ? "..." : activeBorrows.length}
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
                {isLoading ? "..." : borrows.length}
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
                {isLoading ? "..." : returnedBorrows.length}
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
                {isLoading ? "..." : myBooks.length}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Books shared with readers
              </p>
            </div>
          </div>
        </div>

        {/* ৩. একাউন্ট ডিটেইলস ও অ্যাক্টিভিটি সেকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* বাঁ দিকের কলাম: একাউন্ট ডিটেইলস কার্ড */}
          <div className="lg:col-span-5 rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Reader Account Details
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Your credentials and personal library account privileges.
              </p>
            </div>

            <div className="divide-y divide-border/60 text-xs">
              <div className="py-3 flex items-center justify-between">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-semibold text-foreground text-right">
                  {user?.name}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-muted-foreground">Email Address</span>
                <span className="font-semibold text-foreground text-right">
                  {user?.email}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-muted-foreground">Account Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Reader
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-muted-foreground">Borrowing Quota</span>
                <span className="font-semibold text-foreground">
                  Up to 3 concurrent books
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-muted-foreground">
                  Standard Loan Period
                </span>
                <span className="font-semibold text-foreground">
                  14 Days per book
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-muted-foreground">Library Role</span>
                <span className="font-semibold text-foreground">
                  Community Reader / Member
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-muted-foreground">Security</span>
                <span className="font-semibold text-foreground">
                  JWT Session Verified
                </span>
              </div>
            </div>

            {/* কুইক শর্টকাট বাটন */}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/add-book"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className:
                    "w-full justify-center gap-2 rounded-xl text-xs font-semibold",
                })}
              >
                <PlusCircle className="w-4 h-4 text-primary" />
                <span>Contribute / Add a Book</span>
              </Link>
            </div>
          </div>

          {/* ডান দিকের কলাম: সাম্প্রতিক ধার করা বইয়ের প্রিভিউ */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Recent Borrow Activity
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Books you currently hold or recently enjoyed.
                </p>
              </div>

              <Link
                href="/my-borrows"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-xs text-muted-foreground gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading borrowing history...</span>
              </div>
            ) : borrows.length > 0 ? (
              <div className="divide-y divide-border/60">
                {borrows.slice(0, 4).map((record) => {
                  const recordImg =
                    record.bookImage ||
                    (record as { image?: string }).image ||
                    (record as { coverImage?: string }).coverImage ||
                    (record as { imageUrl?: string }).imageUrl ||
                    (record as { cover_image?: string }).cover_image ||
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

                  return (
                    <div
                      key={record._id}
                      className="py-3.5 flex items-center gap-4 group"
                    >
                      <ProfileBookThumbnail
                        src={recordImg}
                        alt={record.bookTitle}
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {record.bookTitle}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          by {record.bookAuthor}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                          <span>
                            Borrowed:{" "}
                            {record.borrowedAt
                              ? new Date(record.borrowedAt).toLocaleDateString()
                              : "Pending approval"}
                          </span>
                          <span>•</span>
                          <span>
                            Due:{" "}
                            {record.dueDate
                              ? new Date(record.dueDate).toLocaleDateString()
                              : "TBD"}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            record.status === "Active"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-border bg-muted/20">
                <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-foreground">
                  No borrowed books yet
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Explore our curated catalog and borrow your first literary
                  treasure today!
                </p>
                <div className="mt-4">
                  <Link
                    href="/books"
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className: "rounded-xl text-xs font-semibold",
                    })}
                  >
                    Browse Books Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
