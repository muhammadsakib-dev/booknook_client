"use client";

import {
  AlertCircle,
  BookOpen,
  Filter,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BookCard } from "@/components/books/BookCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { fetchBooks } from "@/lib/books";
import { cn } from "@/lib/utils";
import { type Book, normalizeBook } from "@/types/book";

const SKELETON_KEYS = [
  "sk-1",
  "sk-2",
  "sk-3",
  "sk-4",
  "sk-5",
  "sk-6",
  "sk-7",
  "sk-8",
];

function BooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState<
    "default" | "copies-desc" | "rating" | "available"
  >("default");

  // Initial load + Inventory change listener
  useEffect(() => {
    void refreshKey;
    async function loadBooks() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        console.error("Failed to load books:", err);
        setErrorMessage(
          "Could not load library catalog from server. Showing available cached items.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadBooks();

    const handleInventoryChange = () => {
      loadBooks();
    };

    window.addEventListener(
      "booknook:inventory-updated",
      handleInventoryChange,
    );
    return () => {
      window.removeEventListener(
        "booknook:inventory-updated",
        handleInventoryChange,
      );
    };
  }, [refreshKey]);

  // Sync state when URL query changes (browser Back/Forward, Header search)
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  // Synchronize search input with URL
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("search", val.trim());
    } else {
      params.delete("search");
    }
    router.replace(`/books?${params.toString()}`, { scroll: false });
  };

  // Synchronize category with URL
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat && cat !== "All") {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    router.replace(`/books?${params.toString()}`, { scroll: false });
  };

  // Reset all filters & clear URL query
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("default");
    router.replace("/books", { scroll: false });
  };

  // Extract unique categories dynamically from books
  const categories = [
    "All",
    ...Array.from(
      new Set(books.map((b) => normalizeBook(b).category).filter(Boolean)),
    ),
  ];

  // Filter and sort books based on active controls
  const filteredBooks = books
    .filter((b) => {
      const item = normalizeBook(b);
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const itemA = normalizeBook(a);
      const itemB = normalizeBook(b);

      if (sortBy === "copies-desc") {
        return itemB.availableCopies - itemA.availableCopies;
      }
      if (sortBy === "available") {
        return (itemB.isAvailable ? 1 : 0) - (itemA.isAvailable ? 1 : 0);
      }
      if (sortBy === "rating") {
        return itemB.rating - itemA.rating;
      }
      return 0;
    });

  return (
    <div className="w-full bg-background min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Page Header Banner */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 mb-8 sm:mb-12 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Library Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Browse Books to <span className="text-primary">Borrow</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Find and borrow physical books for free. Check real-time copy
              availability and add titles directly to your Borrow Bag.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link
              href="/add-book"
              className={cn(
                buttonVariants(),
                "bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-5 shadow-xs flex items-center gap-2",
              )}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Book</span>
            </Link>
          </div>
        </div>

        {/* 2. Optional Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-amber-800 dark:text-amber-300 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="text-xs h-8 border-amber-500/40 hover:bg-amber-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* 3. Search, Filter & Sort Controls */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-8 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input (URL Synced) */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by book title or author..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-muted-foreground">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary cursor-pointer transition-colors"
              >
                <option value="default">Featured / Default</option>
                <option value="copies-desc">Most Copies Available</option>
                <option value="available">Available First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills (URL Synced) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Results Count Bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
          <span>
            Showing{" "}
            <strong className="text-foreground">{filteredBooks.length}</strong>{" "}
            of {books.length} books in catalog
          </span>

          {(searchQuery ||
            selectedCategory !== "All" ||
            sortBy !== "default") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        {/* 5. Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="bg-card border border-border rounded-2xl p-4 flex flex-col space-y-3 animate-pulse"
              >
                <div className="aspect-[3/4] w-full bg-muted rounded-xl" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
                <div className="h-8 w-full bg-muted rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-card border border-border rounded-3xl p-8 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-foreground mb-1">
              No matching books found
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              We couldn&apos;t find any books matching your search or filter
              criteria. Try adjusting your search query.
            </p>
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="cursor-pointer"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
