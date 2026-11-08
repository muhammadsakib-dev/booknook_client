// Ready
"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { toast } from "@/components/ui/sonner";
import { useSession } from "@/lib/auth-client";
import { normalizeBook } from "@/lib/book-utils";
import { deleteBook } from "@/services/delete/deleteBook";
import { getMyBooks } from "@/services/read/getMyBooks";
import { getOwnerBorrows } from "@/services/read/getOwnerBorrows";
import {
  approveBorrow,
  approveReturn,
  rejectBorrow,
} from "@/services/update/borrowApproval";
import { updateBook } from "@/services/update/updateBook";
import type { Book, BorrowRecord } from "@/types/book";
import {
  CatalogStats,
  CatalogTable,
  ContributorHeader,
  DeleteBookModal,
  EditBookModal,
  RequestsStats,
  RequestsTable,
} from "./components";

export default function MyBooksClient() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // 1. ট্যাব স্টেট
  const [activeTab, setActiveTab] = useState<"catalog" | "requests">("catalog");

  // 2. ক্যাটালগ স্টেট
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. ইনকামিং রিকোয়েস্ট স্টেট
  const [requests, setRequests] = useState<BorrowRecord[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestActionId, setRequestActionId] = useState<string | null>(null);

  // 4. এডিট ও ডিলিট মোডাল স্টেট
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // আপলোডকৃত বই লোড করা
  const loadBooks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getMyBooks(userId);
      setBooks(data);
    } catch (e) {
      console.error("Failed to load user books:", e);
    } finally {
      setLoading(false);
    }
  };

  // ইনকামিং ধার নেওয়ার রিকোয়েস্ট লোড করা
  const loadRequests = async () => {
    if (!userId) return;
    setRequestsLoading(true);
    try {
      const data = await getOwnerBorrows();
      setRequests(data);
    } catch (e) {
      console.error("Failed to load incoming requests:", e);
    } finally {
      setRequestsLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load data when userId changes
  useEffect(() => {
    if (userId) {
      loadBooks();
      loadRequests();
      const handleUpdate = () => {
        loadBooks();
        loadRequests();
      };
      window.addEventListener("booknook:inventory-updated", handleUpdate);
      return () => {
        window.removeEventListener("booknook:inventory-updated", handleUpdate);
      };
    }
  }, [userId]);

  // ধার দেওয়ার রিকোয়েস্ট অনুমোদন করা
  const handleApproveBorrow = async (id: string) => {
    if (requestActionId) return;
    setRequestActionId(id);

    const res = await approveBorrow(id);
    setRequestActionId(null);

    if (res.success) {
      toast.success("Borrow request approved! The loan is now active.");
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id
            ? {
                ...r,
                status: "Active",
                borrowedAt: new Date().toISOString(),
                dueDate: new Date(
                  Date.now() + 14 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              }
            : r,
        ),
      );
      loadBooks();
    } else {
      toast.error(res.message || "Failed to approve borrow request.");
    }
  };

  // রিকোয়েস্ট ডিক্লাইন করা
  const handleRejectBorrow = async (id: string) => {
    if (requestActionId) return;
    setRequestActionId(id);

    const res = await rejectBorrow(id, "Declined by contributor");
    setRequestActionId(null);

    if (res.success) {
      toast.success(
        "Borrow request declined. The reserved copy has been restored.",
      );
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id
            ? {
                ...r,
                status: "Rejected",
                rejectionReason: "Declined by you",
              }
            : r,
        ),
      );
      loadBooks();
    } else {
      toast.error(res.message || "Failed to decline request.");
    }
  };

  // রিটার্ন নিশ্চিতকরণ
  const handleApproveReturn = async (id: string) => {
    if (requestActionId) return;
    setRequestActionId(id);

    const res = await approveReturn(id);
    setRequestActionId(null);

    if (res.success) {
      toast.success("Book return confirmed! Inventory copy restored.");
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id
            ? {
                ...r,
                status: "Returned",
                returnedAt: new Date().toISOString(),
              }
            : r,
        ),
      );
      loadBooks();
    } else {
      toast.error(res.message || "Failed to confirm return.");
    }
  };

  // বই আপডেট সংরক্ষণ
  const handleSaveEdit = async (
    bookId: string,
    updatedData: {
      title: string;
      author: string;
      category: string;
      totalCopies: number;
      description: string;
    },
  ) => {
    setIsUpdating(true);
    const res = await updateBook(bookId, updatedData);
    setIsUpdating(false);

    if (res.success) {
      toast.success("Book updated successfully!");
      loadBooks();
      setEditingBook(null);
    } else {
      toast.error(res.message || "Failed to update book.");
    }
  };

  // বই ডিলিট নিশ্চিতকরণ
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    const res = await deleteBook(deletingId);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Book deleted from library!");
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== deletingId));
      setDeletingId(null);
    } else {
      toast.error(res.message || "Cannot delete book while loans are active.");
      setDeletingId(null);
    }
  };

  // পরিসংখ্যান ক্যালকুলেশন
  const normalizedList = books.map(normalizeBook);
  const totalBooks = normalizedList.length;
  const totalCopies = normalizedList.reduce((s, b) => s + b.totalCopies, 0);
  const availableCopies = normalizedList.reduce(
    (s, b) => s + b.availableCopies,
    0,
  );
  const loanedCopies = Math.max(0, totalCopies - availableCopies);

  const pendingRequestsCount = requests.filter(
    (r) => r.status === "Pending",
  ).length;
  const returnRequestsCount = requests.filter(
    (r) => r.status === "Return Pending",
  ).length;
  const activeLoansCount = requests.filter(
    (r) => r.status === "Active" || r.status === "Overdue",
  ).length;
  const totalActionNeeded = pendingRequestsCount + returnRequestsCount;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* হেডার ও প্রাথমিক ট্যাব নেভিগেশন */}
          <ContributorHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            totalBooks={totalBooks}
            totalRequests={requests.length}
            totalActionNeeded={totalActionNeeded}
            onRefresh={() => {
              loadBooks();
              loadRequests();
            }}
            isLoading={loading || requestsLoading}
          />

          {/* ট্যাব ১: ক্যাটালগ ম্যানেজমেন্ট */}
          {activeTab === "catalog" && (
            <div>
              <CatalogStats
                totalBooks={totalBooks}
                totalCopies={totalCopies}
                availableCopies={availableCopies}
                loanedCopies={loanedCopies}
              />
              <CatalogTable
                books={books}
                loading={loading}
                onEdit={(book) => setEditingBook(book)}
                onDelete={(id) => setDeletingId(id)}
              />
            </div>
          )}

          {/* ট্যাব ২: ইনকামিং রিকোয়েস্ট ম্যানেজমেন্ট */}
          {activeTab === "requests" && (
            <div>
              <RequestsStats
                pendingCount={pendingRequestsCount}
                returnCount={returnRequestsCount}
                activeCount={activeLoansCount}
                totalCount={requests.length}
              />
              <RequestsTable
                requests={requests}
                loading={requestsLoading}
                actionLoadingId={requestActionId}
                onApprove={handleApproveBorrow}
                onReject={handleRejectBorrow}
                onConfirmReturn={handleApproveReturn}
              />
            </div>
          )}

          {/* এডিট মোডাল */}
          <EditBookModal
            isOpen={!!editingBook}
            book={editingBook}
            isUpdating={isUpdating}
            onClose={() => setEditingBook(null)}
            onSave={handleSaveEdit}
          />

          {/* ডিলিট মোডাল */}
          <DeleteBookModal
            isOpen={!!deletingId}
            isDeleting={isDeleting}
            onClose={() => setDeletingId(null)}
            onConfirm={handleConfirmDelete}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
