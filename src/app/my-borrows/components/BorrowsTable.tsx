// Ready
"use client";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Mail,
  RotateCcw,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { BorrowRecord } from "@/types/book";
import { BorrowBookThumbnail } from "./BorrowBookThumbnail";

interface BorrowsTableProps {
  items: BorrowRecord[];
  loading: boolean;
  search: string;
  actionId: string | null;
  onRequestReturn: (id: string) => Promise<void>;
  onCancelRequest: (id: string) => Promise<void>;
}

export function BorrowsTable({
  items,
  loading,
  search,
  actionId,
  onRequestReturn,
  onCancelRequest,
}: BorrowsTableProps) {
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Loading your borrow records...
      </div>
    );
  }

  if (items.length === 0) {
    return (
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
    );
  }

  return (
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
            {items.map((item) => {
              const isPending = item.status === "Pending";
              const isActive = item.status === "Active";
              const isReturnPending = item.status === "Return Pending";
              const isReturned = item.status === "Returned";
              const isOverdue = item.status === "Overdue";
              const isRejected =
                item.status === "Rejected" || item.status === "Cancelled";

              const bookTitle = item.bookTitle || "Borrowed Book";

              return (
                <tr
                  key={item._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* Book & Contributor */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3.5 min-w-60">
                      <BorrowBookThumbnail
                        src={item.bookImage}
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
                        {item.ownerEmail && (
                          <a
                            href={`mailto:${item.ownerEmail}`}
                            className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5"
                          >
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>Mail: {item.ownerEmail}</span>
                          </a>
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
                            ? new Date(item.requestedAt).toLocaleDateString()
                            : "Recently"}
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          Requested
                        </p>
                      </div>
                    ) : item.borrowedAt ? (
                      <div>
                        <span className="font-medium text-foreground">
                          {new Date(item.borrowedAt).toLocaleDateString()}
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
                            isOverdue ? "text-destructive font-bold" : ""
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
                        onClick={() => onCancelRequest(item._id)}
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
                        onClick={() => onRequestReturn(item._id)}
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
  );
}
