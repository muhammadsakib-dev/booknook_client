// Ready
"use client";

import {
  Check,
  CheckCircle2,
  Clock,
  Inbox,
  Mail,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BorrowRecord } from "@/types/book";
import { BookThumbnail } from "./BookThumbnail";

interface RequestsTableProps {
  requests: BorrowRecord[];
  loading: boolean;
  actionLoadingId: string | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onConfirmReturn: (id: string) => Promise<void>;
}

export function RequestsTable({
  requests,
  loading,
  actionLoadingId,
  onApprove,
  onReject,
  onConfirmReturn,
}: RequestsTableProps) {
  const [requestSearch, setRequestSearch] = useState("");
  const [requestFilter, setRequestFilter] = useState<
    "all" | "pending" | "active" | "return-pending" | "returned"
  >("all");

  const pendingRequestsCount = requests.filter(
    (r) => r.status === "Pending",
  ).length;
  const returnRequestsCount = requests.filter(
    (r) => r.status === "Return Pending",
  ).length;
  const activeLoansCount = requests.filter(
    (r) => r.status === "Active" || r.status === "Overdue",
  ).length;

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.bookTitle?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.userName?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.userEmail?.toLowerCase().includes(requestSearch.toLowerCase());

    let matchesStatus = true;
    if (requestFilter === "pending") {
      matchesStatus = r.status === "Pending";
    } else if (requestFilter === "active") {
      matchesStatus = r.status === "Active" || r.status === "Overdue";
    } else if (requestFilter === "return-pending") {
      matchesStatus = r.status === "Return Pending";
    } else if (requestFilter === "returned") {
      matchesStatus = r.status === "Returned";
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* ফিল্টার এবং সার্চ বার */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by book or reader name/email..."
            value={requestSearch}
            onChange={(e) => setRequestSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-card border border-border rounded-xl">
          <button
            type="button"
            onClick={() => setRequestFilter("all")}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              requestFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setRequestFilter("pending")}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              requestFilter === "pending"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending ({pendingRequestsCount})
          </button>
          <button
            type="button"
            onClick={() => setRequestFilter("return-pending")}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              requestFilter === "return-pending"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Return Pending ({returnRequestsCount})
          </button>
          <button
            type="button"
            onClick={() => setRequestFilter("active")}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              requestFilter === "active"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Active Loans ({activeLoansCount})
          </button>
        </div>
      </div>

      {/* রিকোয়েস্ট টেবিল / লোডিং / খালি অবস্থা */}
      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading incoming requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-md mx-auto">
          <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground mb-1">
            No Incoming Requests
          </h3>
          <p className="text-xs text-muted-foreground">
            {requestSearch
              ? "No borrow requests match your search."
              : "You have no pending borrow or return requests for your books at the moment."}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Book</th>
                  <th className="py-3 px-4">Borrower (Reader)</th>
                  <th className="py-3 px-4">Timeline / Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Decision / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequests.map((req) => {
                  const isPending = req.status === "Pending";
                  const isReturnPending = req.status === "Return Pending";
                  const isActive = req.status === "Active";
                  const isReturned = req.status === "Returned";
                  const isOverdue = req.status === "Overdue";
                  const isRejected =
                    req.status === "Rejected" || req.status === "Cancelled";

                  return (
                    <tr
                      key={req._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Book Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-50">
                          <BookThumbnail
                            src={req.bookImage}
                            alt={req.bookTitle}
                          />
                          <div>
                            <p className="font-bold text-sm text-foreground line-clamp-1">
                              {req.bookTitle}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {req.bookAuthor} • {req.quantity}{" "}
                              {req.quantity === 1 ? "Copy" : "Copies"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Borrower Details */}
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-primary" />
                            <span>
                              {req.userName ||
                                req.borrowerName ||
                                "Registered Reader"}
                            </span>
                          </div>
                          {(req.userEmail || req.borrowerEmail) && (
                            <a
                              href={`mailto:${
                                req.userEmail || req.borrowerEmail
                              }`}
                              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5"
                            >
                              <Mail className="w-3 h-3" />
                              <span>{req.userEmail || req.borrowerEmail}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Timeline */}
                      <td className="py-3 px-4 text-muted-foreground">
                        {isPending ? (
                          <div>
                            <p className="font-medium text-foreground">
                              {req.requestedAt
                                ? new Date(req.requestedAt).toLocaleDateString()
                                : "Recent"}
                            </p>
                            <p className="text-[10px]">
                              Awaiting your approval
                            </p>
                          </div>
                        ) : isReturnPending ? (
                          <div>
                            <p className="font-medium text-blue-600 dark:text-blue-400">
                              {req.returnRequestedAt
                                ? new Date(
                                    req.returnRequestedAt,
                                  ).toLocaleDateString()
                                : "Recent"}
                            </p>
                            <p className="text-[10px]">
                              Return confirmation requested
                            </p>
                          </div>
                        ) : isActive && req.dueDate ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>
                              Due: {new Date(req.dueDate).toLocaleDateString()}
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
                        {isReturnPending && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] font-semibold"
                          >
                            Return Pending
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
                            {req.status}
                          </Badge>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        {isPending && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              disabled={actionLoadingId === req._id}
                              onClick={() => onApprove(req._id)}
                              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer"
                            >
                              {actionLoadingId === req._id ? (
                                <span>Saving...</span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  Approve
                                </span>
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoadingId === req._id}
                              onClick={() => onReject(req._id)}
                              className="h-8 border-border hover:border-destructive hover:text-destructive text-xs cursor-pointer font-medium"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}

                        {isReturnPending && (
                          <Button
                            size="sm"
                            disabled={actionLoadingId === req._id}
                            onClick={() => onConfirmReturn(req._id)}
                            className="h-8 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-xs cursor-pointer"
                          >
                            {actionLoadingId === req._id ? (
                              <span>Saving...</span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Confirm Return Received
                              </span>
                            )}
                          </Button>
                        )}

                        {isActive && (
                          <span className="text-xs text-muted-foreground font-medium">
                            Loan active with reader
                          </span>
                        )}

                        {isReturned && (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        )}

                        {isRejected && (
                          <span className="text-xs text-muted-foreground">
                            {req.rejectionReason || "Closed"}
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
  );
}
