// Ready
"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { toast } from "@/components/ui/sonner";
import { getBorrows } from "@/services/read/getBorrows";
import { rejectBorrow, requestReturn } from "@/services/update/borrowApproval";
import type { BorrowRecord } from "@/types/book";
import {
  type BorrowFilterStatus,
  BorrowsFilterBar,
  BorrowsHeader,
  BorrowsTable,
} from "./components";

export default function MyBorrowsClient() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BorrowFilterStatus>("all");
  const [actionId, setActionId] = useState<string | null>(null);

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
      toast.success(
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
      toast.error(res.message || "Failed to submit return request.");
    }
  };

  // পেন্ডিং রিকোয়েস্ট বাতিল করা
  const handleCancelRequest = async (id: string) => {
    if (actionId) return;
    setActionId(id);

    const res = await rejectBorrow(id, "Cancelled by borrower");
    setActionId(null);

    if (res.success) {
      toast.success(
        "Borrow request cancelled. The reserved copy has been freed.",
      );
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
      toast.error(res.message || "Failed to cancel request.");
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
          <BorrowsHeader
            activeCount={activeCount}
            pendingCount={pendingCount}
            returnedCount={returnedCount}
          />

          <BorrowsFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            totalCount={borrows.length}
            pendingCount={pendingCount}
            activeCount={activeCount}
            returnPendingCount={returnPendingCount}
            returnedCount={returnedCount}
          />

          <BorrowsTable
            items={filtered}
            loading={loading}
            search={search}
            actionId={actionId}
            onRequestReturn={handleRequestReturn}
            onCancelRequest={handleCancelRequest}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
