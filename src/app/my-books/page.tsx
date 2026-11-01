"use client";

import { cn } from "cn";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  Edit3,
  Eye,
  Layers,
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
import {
  deleteBook,
  fetchBooks,
  notifyInventoryUpdated,
  updateBook,
} from "@/lib/books";
import { type Book, normalizeBook } from "@/types/book";

export default function MyBooksPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCopies, setEditCopies] = useState(1);
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirm Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRefresh = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchBooks({ ownerUserId: userId });
      setBooks(data);
    } catch (e) {
      console.error("Failed to refresh books:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    let active = true;
    setLoading(true);

    fetchBooks({ ownerUserId: userId })
      .then((data) => {
        if (active) setBooks(data);
      })
      .catch((e) => {
        console.error("Failed to load user books:", e);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const handleInventoryUpdate = () => {
      fetchBooks({ ownerUserId: userId })
        .then((data) => {
          if (active) setBooks(data);
        })
        .catch((e) => {
          console.error("Failed to revalidate books:", e);
        });
    };

    window.addEventListener(
      "booknook:inventory-updated",
      handleInventoryUpdate,
    );
    return () => {
      active = false;
      window.removeEventListener(
        "booknook:inventory-updated",
        handleInventoryUpdate,
      );
    };
  }, [userId]);

  // Compute summary metrics (Phase 07 Canonical Formula)
  const normalizedList = books.map(normalizeBook);
  const totalBooks = normalizedList.length;
  const totalCopiesCount = normalizedList.reduce(
    (sum, b) => sum + b.totalCopies,
    0,
  );
  const totalAvailableCount = normalizedList.reduce(
    (sum, b) => sum + b.availableCopies,
    0,
  );
  const totalLoanedOut = Math.max(0, totalCopiesCount - totalAvailableCount);

  // Filtered books
  const filtered = normalizedList.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const allCategories = [
    "All",
    ...Array.from(new Set(normalizedList.map((b) => b.category))),
  ];

  // Open Edit Modal
  const handleOpenEdit = (b: Book) => {
    const norm = normalizeBook(b);
    setEditingBook(b);
    setEditTitle(norm.title);
    setEditAuthor(norm.author);
    setEditCategory(norm.category);
    setEditCopies(norm.totalCopies);
    setEditImage(norm.image || "");
    setEditDescription(norm.description);
  };

  const editingNorm = editingBook ? normalizeBook(editingBook) : null;
  const activeLoansOnEditingBook = editingNorm
    ? Math.max(0, editingNorm.totalCopies - editingNorm.availableCopies)
    : 0;

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setIsUpdating(true);
    // Never allow client modification of availableCopies, ownerUserId, or createdAt.
    // The backend calculates and enforces availableCopies = totalCopies - activeLoanedCount.
    const updatedData: Partial<Book> = {
      title: editTitle.trim(),
      author: editAuthor.trim(),
      category: editCategory.trim(),
      totalCopies: Number(editCopies),
      description: editDescription.trim(),
      image: editImage.trim() || undefined,
    };

    const res = await updateBook(editingBook._id, updatedData);
    setIsUpdating(false);

    if (res.success) {
      showToast("Book updated successfully!");
      notifyInventoryUpdated();
      if (userId) {
        const refreshed = await fetchBooks({ ownerUserId: userId });
        setBooks(refreshed);
      }
      setEditingBook(null);
    } else {
      showToast(res.message || "Failed to update book.");
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    const res = await deleteBook(deletingId);
    setIsDeleting(false);

    if (res.success) {
      showToast("Book deleted from library!");
      notifyInventoryUpdated();
      setBooks((prev) => prev.filter((b) => b._id !== deletingId));
      setDeletingId(null);
    } else {
      showToast(
        res.message ||
          "Cannot delete book while there are active reader loans.",
      );
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toast notification */}
          {toastMsg && (
            <div className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-300">
              <Check className="w-4 h-4" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* 1. Breadcrumbs */}
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

          {/* 2. Header Banner */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Library Management</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
                My Books & <span className="text-primary">Inventory</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Manage your registered library books, monitor active copy
                availability, update title details, or register new volumes for
                readers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-border hover:bg-muted h-11 px-4 cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Link
                href="/add-book"
                className={cn(
                  buttonVariants(),
                  "bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-5 font-semibold cursor-pointer flex items-center gap-2",
                )}
              >
                <Plus className="w-4 h-4" />
                <span>Add New Book</span>
              </Link>
            </div>
          </div>

          {/* 3. Summary Stats Row (Phase 07 Formula) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Books
              </p>
              <p className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                {totalBooks}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Owned unique titles
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Copies
              </p>
              <p className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                {totalCopiesCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All physical volumes
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Available Copies
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                {totalAvailableCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Ready for loan
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Currently Loaned
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
                {totalLoanedOut}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                With readers now
              </p>
            </div>
          </div>

          {/* 4. Filter & Search Controls */}
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-8 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by book title or author..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-medium text-muted-foreground shrink-0">
                Category:
              </span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors cursor-pointer"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Books Table / List */}
          {loading ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading your books inventory...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                No Books Found
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || filterCategory !== "All"
                  ? "No books match your current filters. Try resetting search criteria."
                  : "You have not added any books to your inventory yet. Start by registering one!"}
              </p>
              <Link
                href="/add-book"
                className={cn(
                  buttonVariants(),
                  "bg-primary text-primary-foreground hover:bg-primary/90 mt-2",
                )}
              >
                Add a Book
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="py-4 px-6">Book</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4 text-center">Total Copies</th>
                      <th className="py-4 px-4 text-center">Available</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {filtered.map((item) => {
                      const originalBook = books.find(
                        (b) => b._id === item.id,
                      ) || {
                        _id: item.id,
                        title: item.title,
                      };

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-muted/30 transition-colors group"
                        >
                          {/* Book Info & Cover */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-16 rounded-md overflow-hidden bg-muted shrink-0 border border-border shadow-2xs">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/books/${item.id}`}
                                  className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                                >
                                  {item.title}
                                </Link>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  by {item.author}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </td>

                          {/* Total Copies */}
                          <td className="py-4 px-4 text-center font-semibold text-foreground">
                            {item.totalCopies}
                          </td>

                          {/* Available Copies */}
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${
                                item.availableCopies > 0
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              <Layers className="w-3.5 h-3.5" />
                              {item.availableCopies} Left
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            <Badge
                              variant={
                                item.isAvailable ? "default" : "secondary"
                              }
                              className={`text-xs ${
                                item.isAvailable
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {item.isAvailable ? "Available" : "All Borrowed"}
                            </Badge>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/books/${item.id}`}
                                className={cn(
                                  buttonVariants({
                                    variant: "ghost",
                                    size: "sm",
                                  }),
                                  "h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center",
                                )}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEdit(originalBook)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary cursor-pointer"
                                title="Edit Book Details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingId(item.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                                title="Delete Book"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Edit Book Modal (Phase 07 Compliant) */}
          {editingBook && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-primary" />
                    Edit Book Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingBook(null)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
                  <div>
                    <label
                      htmlFor="edit-title"
                      className="block text-xs font-semibold text-foreground mb-1"
                    >
                      Title
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="edit-author"
                        className="block text-xs font-semibold text-foreground mb-1"
                      >
                        Author
                      </label>
                      <input
                        id="edit-author"
                        type="text"
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        required
                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-category"
                        className="block text-xs font-semibold text-foreground mb-1"
                      >
                        Category
                      </label>
                      <input
                        id="edit-category"
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        required
                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Total Copies & Inventory Calculation Notice */}
                  <div>
                    <label
                      htmlFor="edit-copies"
                      className="block text-xs font-semibold text-foreground mb-1"
                    >
                      Total Copies in Collection
                    </label>
                    <input
                      id="edit-copies"
                      type="number"
                      min={Math.max(1, activeLoansOnEditingBook)}
                      value={editCopies}
                      onChange={(e) => setEditCopies(Number(e.target.value))}
                      required
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                    />

                    <div className="mt-2 p-2.5 rounded-lg bg-muted/50 border border-border/60 text-xs space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Active loans with readers:</span>
                        <span className="font-semibold text-foreground">
                          {activeLoansOnEditingBook}{" "}
                          {activeLoansOnEditingBook === 1 ? "copy" : "copies"}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Calculated available copies:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.max(0, editCopies - activeLoansOnEditingBook)}{" "}
                          copies
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        * Available copies are automatically enforced by the
                        server as Total Copies minus Active Loans.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="edit-image"
                      className="block text-xs font-semibold text-foreground mb-1"
                    >
                      Cover Image URL
                    </label>
                    <input
                      id="edit-image"
                      type="url"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-description"
                      className="block text-xs font-semibold text-foreground mb-1"
                    >
                      Synopsis / Description
                    </label>
                    <textarea
                      id="edit-description"
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingBook(null)}
                      className="border-border hover:bg-muted cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 7. Delete Confirmation Dialog */}
          {deletingId && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Delete Book from Library?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone. Readers will no longer be able
                    to borrow this title. Note: books with active reader loans
                    cannot be deleted until all copies are returned.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeletingId(null)}
                    disabled={isDeleting}
                    className="border-border hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="cursor-pointer"
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete Book"}
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
