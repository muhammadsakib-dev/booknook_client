// Complete the MyBooksPage component

"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Inbox,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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

const DEFAULT_BOOK_COVER =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

function BookThumbnail({ src, alt }: { src?: string | null; alt: string }) {
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
    <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/60 shadow-2xs relative aspect-[3/4]">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 40px, 48px"
        unoptimized
        onError={() => setImgSrc(DEFAULT_BOOK_COVER)}
        className="object-cover"
      />
    </div>
  );
}

export default function MyBooksPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    document.title = "BookNook | My Books & Requests";
  }, []);

  // ট্যাব স্টেট
  const [activeTab, setActiveTab] = useState<"catalog" | "requests">("catalog");

  // ক্যাটালগ স্টেট
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // ইনকামিং রিকোয়েস্ট স্টেট
  const [requests, setRequests] = useState<BorrowRecord[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestSearch, setRequestSearch] = useState("");
  const [requestFilter, setRequestFilter] = useState<
    "all" | "pending" | "active" | "return-pending" | "returned"
  >("all");
  const [requestActionId, setRequestActionId] = useState<string | null>(null);

  // এডিট মোডাল স্টেট
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCopies, setEditCopies] = useState(1);
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // ডিলিট স্টেট
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // আপলোডকৃত বই তালিকা লোড করা
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

  // রিকোয়েস্ট ডিক্লাইন/রিজেক্ট করা
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

  // ফিল্টার ও পরিসংখ্যান (ক্যাটালগ)
  const normalizedList = books.map(normalizeBook);
  const totalBooks = normalizedList.length;
  const totalCopies = normalizedList.reduce((s, b) => s + b.totalCopies, 0);
  const availableCopies = normalizedList.reduce(
    (s, b) => s + b.availableCopies,
    0,
  );
  const loanedCopies = Math.max(0, totalCopies - availableCopies);

  const categories = [
    "All",
    ...Array.from(new Set(normalizedList.map((b) => b.category))),
  ];

  const filteredBooks = normalizedList.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // রিকোয়েস্ট কাউন্ট ও ফিল্টারিং
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

  // এডিট সংরক্ষণ
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setIsUpdating(true);
    const res = await updateBook(editingBook._id, {
      title: editTitle.trim(),
      author: editAuthor.trim(),
      category: editCategory.trim(),
      totalCopies: Number(editCopies),
      description: editDescription.trim(),
    });
    setIsUpdating(false);

    if (res.success) {
      toast.success("Book updated successfully!");
      loadBooks();
      setEditingBook(null);
    } else {
      toast.error(res.message || "Failed to update book.");
    }
  };

  // ডিলিট নিশ্চিতকরণ
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    const res = await deleteBook(deletingId);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Book deleted from library!");
      setBooks((prev) => prev.filter((b) => b._id !== deletingId));
      setDeletingId(null);
    } else {
      toast.error(res.message || "Cannot delete book while loans are active.");
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Monitor your registered titles, approve incoming reader
                requests, and confirm returns.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  loadBooks();
                  loadRequests();
                }}
                className="gap-1.5"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    loading || requestsLoading ? "animate-spin" : ""
                  }`}
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
              onClick={() => setActiveTab("catalog")}
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
              onClick={() => setActiveTab("requests")}
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
                  {requests.length}
                </span>
              )}
            </button>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: ক্যাটালগ ম্যানেজমেন্ট ভিউ */}
          {/* ============================================================== */}
          {activeTab === "catalog" && (
            <div>
              {/* ইনভেন্টরি পরিসংখ্যান */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Titles
                  </p>
                  <p className="text-2xl font-black text-foreground mt-1">
                    {totalBooks}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Copies
                  </p>
                  <p className="text-2xl font-black text-foreground mt-1">
                    {totalCopies}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Available Copies
                  </p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {availableCopies}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Currently Loaned
                  </p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                    {loanedCopies}
                  </p>
                </div>
              </div>

              {/* সার্চ ও ফিল্টার */}
              <div className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search your books..."
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Category:
                  </span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* বইয়ের তালিকা */}
              {loading ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  Loading your books...
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-md mx-auto">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-base font-bold text-foreground mb-1">
                    No Books Found
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {search
                      ? "No books match your search."
                      : "You have not added any books to BookNook yet."}
                  </p>
                  <Link
                    href="/add-book"
                    className={buttonVariants({
                      size: "sm",
                      className: "bg-primary text-primary-foreground",
                    })}
                  >
                    Add Your First Book
                  </Link>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider">
                          <th className="py-3 px-4">Book</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Available</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredBooks.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3 min-w-[200px]">
                                <BookThumbnail
                                  src={item.image}
                                  alt={item.title}
                                />
                                <div>
                                  <Link
                                    href={`/books/${item.id}`}
                                    className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                                  >
                                    {item.title}
                                  </Link>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {item.author}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-primary/10 text-primary font-medium"
                              >
                                {item.category}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`font-bold ${
                                  item.availableCopies > 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-500"
                                }`}
                              >
                                {item.availableCopies}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-foreground">
                              {item.totalCopies}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  item.isAvailable
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-rose-500/10 text-rose-500"
                                }`}
                              >
                                {item.isAvailable ? "Available" : "All Loaned"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-muted"
                                  onClick={() => {
                                    const b = books.find(
                                      (orig) => orig._id === item.id,
                                    );
                                    if (b) {
                                      setEditingBook(b);
                                      setEditTitle(b.title || "");
                                      setEditAuthor(b.author || "");
                                      setEditCategory(b.category || "Fiction");
                                      setEditCopies(
                                        Number(b.totalCopies ?? b.copies ?? 1),
                                      );
                                      setEditDescription(b.description || "");
                                    }
                                  }}
                                  aria-label="Edit book"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                                  onClick={() => setDeletingId(item.id)}
                                  aria-label="Delete book"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ইনকামিং রিকোয়েস্ট ম্যানেজমেন্ট ভিউ */}
          {/* ============================================================== */}
          {activeTab === "requests" && (
            <div>
              {/* রিকোয়েস্ট পরিসংখ্যান ব্যানার */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Pending Borrow Requests
                  </p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                    {pendingRequestsCount}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Return Confirmations
                  </p>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {returnRequestsCount}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Active Reader Loans
                  </p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {activeLoansCount}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Borrow Records
                  </p>
                  <p className="text-2xl font-black text-foreground mt-1">
                    {requests.length}
                  </p>
                </div>
              </div>

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

              {/* রিকোয়েস্ট টেবিল */}
              {requestsLoading ? (
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
                          <th className="py-3 px-4 text-right">
                            Decision / Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredRequests.map((req) => {
                          const isPending = req.status === "Pending";
                          const isReturnPending =
                            req.status === "Return Pending";
                          const isActive = req.status === "Active";
                          const isReturned = req.status === "Returned";
                          const isOverdue = req.status === "Overdue";
                          const isRejected =
                            req.status === "Rejected" ||
                            req.status === "Cancelled";

                          return (
                            <tr
                              key={req._id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              {/* Book Details */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3 min-w-[200px]">
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
                                      <span>
                                        {req.userEmail || req.borrowerEmail}
                                      </span>
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
                                        ? new Date(
                                            req.requestedAt,
                                          ).toLocaleDateString()
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
                                      Due:{" "}
                                      {new Date(
                                        req.dueDate,
                                      ).toLocaleDateString()}
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
                                      disabled={requestActionId === req._id}
                                      onClick={() =>
                                        handleApproveBorrow(req._id)
                                      }
                                      className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer"
                                    >
                                      {requestActionId === req._id ? (
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
                                      disabled={requestActionId === req._id}
                                      onClick={() =>
                                        handleRejectBorrow(req._id)
                                      }
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
                                    disabled={requestActionId === req._id}
                                    onClick={() => handleApproveReturn(req._id)}
                                    className="h-8 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-xs cursor-pointer"
                                  >
                                    {requestActionId === req._id ? (
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
          )}

          {/* 6. এডিট মোডাল */}
          {editingBook && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <h3 className="font-bold text-base text-foreground">
                    Edit Book Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingBook(null)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="edit-title"
                      className="block text-xs font-semibold text-muted-foreground mb-1"
                    >
                      Title
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="edit-author"
                        className="block text-xs font-semibold text-muted-foreground mb-1"
                      >
                        Author
                      </label>
                      <input
                        id="edit-author"
                        type="text"
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        required
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-copies"
                        className="block text-xs font-semibold text-muted-foreground mb-1"
                      >
                        Total Copies
                      </label>
                      <input
                        id="edit-copies"
                        type="number"
                        min={1}
                        value={editCopies}
                        onChange={(e) => setEditCopies(Number(e.target.value))}
                        required
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="edit-description"
                      className="block text-xs font-semibold text-muted-foreground mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBook(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isUpdating}
                      className="bg-primary text-primary-foreground hover:bg-primary-hover"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 7. ডিলিট নিশ্চিতকরণ মোডাল */}
          {deletingId && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
                <Trash2 className="w-10 h-10 text-destructive mx-auto" />
                <h3 className="font-bold text-base text-foreground">
                  Delete Book?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Are you sure you want to delete this book? This action cannot
                  be undone if copies are not loaned out.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={isDeleting}
                    onClick={handleConfirmDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
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
