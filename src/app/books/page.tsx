// Complete the BooksPage component

"use client";

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/services/read/getBooks";
import { type Book, normalizeBook } from "@/types/book";

const BOOKS_PER_PAGE = 8;

function BooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");

  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState(urlSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory || "All",
  );
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Set title
  useEffect(() => {
    document.title = "BookNook | All Books";
  }, []);

  // Fetch books
  useEffect(() => {
    getBooks().then(setBooks);
  }, []);

  // Sync URL category
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
      setCurrentPage(1);
    }
  }, [urlCategory]);

  // Sync URL search
  useEffect(() => {
    setSearch(urlSearch || "");
    setCurrentPage(1);
  }, [urlSearch]);

  // Reset filters
  const handleReset = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("default");
    setCurrentPage(1);
    router.replace("/books");
  };

  // Build categories
  const categories = [
    "All",
    ...Array.from(
      new Set(books.map((b) => normalizeBook(b).category).filter(Boolean)),
    ),
  ];

  // Filter and sort
  const filteredBooks = books
    .filter((b) => {
      const item = normalizeBook(b);
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const itemA = normalizeBook(a);
      const itemB = normalizeBook(b);
      if (sortBy === "copies-desc")
        return itemB.availableCopies - itemA.availableCopies;
      if (sortBy === "available")
        return (itemB.isAvailable ? 1 : 0) - (itemA.isAvailable ? 1 : 0);
      if (sortBy === "rating") return itemB.rating - itemA.rating;
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + BOOKS_PER_PAGE,
  );

  return (
    <div className="w-full bg-background min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-8 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by book title or author..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Sort select */}
            <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
              <span className="text-xs font-medium text-muted-foreground shrink-0">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary cursor-pointer transition-colors flex-1 sm:flex-initial"
              >
                <option value="default">Default</option>
                <option value="copies-desc">Most Copies Available</option>
                <option value="available">Available First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category list */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 pt-3 sm:pt-2 border-t border-border/60">
            <div className="flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-primary" />
                Category:
              </span>
              <span className="text-xs font-medium text-primary sm:hidden">
                {selectedCategory === "All" ? "All" : selectedCategory}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth touch-pan-x">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer select-none active:scale-95 whitespace-nowrap ${
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
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
          <span>
            Showing{" "}
            <strong className="text-foreground">
              {filteredBooks.length === 0 ? 0 : startIndex + 1}–
              {Math.min(startIndex + BOOKS_PER_PAGE, filteredBooks.length)}
            </strong>{" "}
            of {filteredBooks.length} books (Page {currentPage} of{" "}
            {totalPages || 1})
          </span>

          {(search || selectedCategory !== "All" || sortBy !== "default") && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Book grid */}
        {currentBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground mb-1">
              No matching books found
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Try adjusting your search query or category filter.
            </p>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 sm:mt-16">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "border border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
