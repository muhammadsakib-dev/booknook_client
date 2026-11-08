// Ready

"use client";

import { ChevronLeft, ChevronRight, Library } from "lucide-react";
import { useEffect, useState } from "react";
import { BookCard } from "@/components/books/BookCard";
import { normalizeBook } from "@/lib/book-utils";
import { getBooks } from "@/services/read/getBooks";
import type { Book } from "@/types/book";

const BOOKS_PER_PAGE = 8;

export default function BooksCatalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch books & sync with global inventory updates
  useEffect(() => {
    const loadBooks = () => {
      getBooks().then(setBooks);
    };

    loadBooks();
    window.addEventListener("booknook:inventory-updated", loadBooks);
    return () => {
      window.removeEventListener("booknook:inventory-updated", loadBooks);
    };
  }, []);

  // Pre-normalize books once for fast sorting
  const items = books.map((b) => ({
    book: b,
    normalized: normalizeBook(b),
  }));

  // Sort books
  const sortedBooks = [...items]
    .sort((a, b) => {
      if (sortBy === "copies-desc")
        return b.normalized.availableCopies - a.normalized.availableCopies;
      if (sortBy === "available")
        return (
          (b.normalized.isAvailable ? 1 : 0) -
          (a.normalized.isAvailable ? 1 : 0)
        );
      if (sortBy === "rating") return b.normalized.rating - a.normalized.rating;
      return 0;
    })
    .map((i) => i.book);

  // Calculate pagination
  const totalPages = Math.ceil(sortedBooks.length / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const currentBooks = sortedBooks.slice(
    startIndex,
    startIndex + BOOKS_PER_PAGE,
  );

  return (
    <div className="w-full bg-background min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Sort Controls */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-8 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              All Books
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {sortedBooks.length}
              </span>{" "}
              {sortedBooks.length === 1 ? "book" : "books"} in the community
              catalog
            </p>
          </div>

          {/* Normal Sort section */}
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

        {/* Book Grid */}
        {currentBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-md mx-auto">
            <Library className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground mb-1">
              No books found
            </h3>
            <p className="text-xs text-muted-foreground">
              There are currently no books available in the catalog.
            </p>
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
