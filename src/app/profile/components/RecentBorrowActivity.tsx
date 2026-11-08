// Ready

"use client";

import { BookOpen, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { BorrowRecord } from "@/types/book";
import { ProfileBookThumbnail } from "./ProfileBookThumbnail";

interface RecentBorrowActivityProps {
  borrows: BorrowRecord[];
  isLoading: boolean;
}

export function RecentBorrowActivity({
  borrows,
  isLoading,
}: RecentBorrowActivityProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
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
          {borrows.slice(0, 4).map((record) => (
            <div
              key={record._id}
              className="py-3.5 flex items-center gap-4 group"
            >
              <ProfileBookThumbnail
                src={record.bookImage}
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
          ))}
        </div>
      ) : (
        <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-border bg-muted/20">
          <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-foreground">
            No borrowed books yet
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Explore our curated catalog and borrow your first literary treasure
            today!
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
  );
}
