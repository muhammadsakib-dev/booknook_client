// Complete the MyBooksPage component

"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { deleteBook } from "@/services/delete/deleteBook";
import { getMyBooks } from "@/services/read/getMyBooks";
import { updateBook } from "@/services/update/updateBook";
import { type Book, normalizeBook } from "@/types/book";

export default function MyBooksPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

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
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // বই তালিকা লোড করা
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: load books when userId changes
  useEffect(() => {
    loadBooks();
  }, [userId]);

  // ফিল্টার ও পরিসংখ্যান
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

  const filtered = normalizedList.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || b.category === filterCategory;
    return matchesSearch && matchesCategory;
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
      showToast("Book updated successfully!");
      loadBooks();
      setEditingBook(null);
    } else {
      showToast(res.message || "Failed to update book.");
    }
  };

  // ডিলিট নিশ্চিতকরণ
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    const res = await deleteBook(deletingId);
    setIsDeleting(false);

    if (res.success) {
      showToast("Book deleted from library!");
      setBooks((prev) => prev.filter((b) => b._id !== deletingId));
      setDeletingId(null);
    } else {
      showToast(res.message || "Cannot delete book while loans are active.");
      setDeletingId(null);
    }
  };

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
            <span className="text-foreground font-medium">My Books</span>
          </div>

          {/* 2. হেডার ব্যানার */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>My Collection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Manage Registered Books
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                View your registered titles, monitor copies, and edit details.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={loadBooks}
                className="gap-1.5"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
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

          {/* 3. ইনভেন্টরি পরিসংখ্যান */}
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

          {/* 4. সার্চ ও ফিল্টার */}
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
              <span className="text-xs text-muted-foreground">Category:</span>
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

          {/* 5. বইয়ের তালিকা */}
          {loading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading your books...
            </div>
          ) : filtered.length === 0 ? (
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
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((book) => (
                      <tr
                        key={book.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-10 h-14 relative rounded overflow-hidden shrink-0 bg-muted">
                            <Image
                              src={book.image}
                              alt={book.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground line-clamp-1">
                              {book.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {book.author}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-[10px]">
                            {book.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                          {book.availableCopies} Copies
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {book.totalCopies} Copies
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const original =
                                books.find((b) => b._id === book.id) || null;
                              setEditingBook(original);
                              setEditTitle(book.title);
                              setEditAuthor(book.author);
                              setEditCategory(book.category);
                              setEditCopies(book.totalCopies);
                              setEditDescription(book.description);
                            }}
                            className="h-8 px-2.5 text-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletingId(book.id)}
                            className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. এডিট মোডাল */}
          {editingBook && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-foreground">
                    Edit Book
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
