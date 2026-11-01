"use client";

import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookCard } from "@/components/books/BookCard";
import { buttonVariants } from "@/components/ui/button";
import { fetchBooks } from "@/lib/books";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";

const SKELETON_KEYS = [
  "skel-1",
  "skel-2",
  "skel-3",
  "skel-4",
  "skel-5",
  "skel-6",
];

export function RecentBooksShowcase() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      try {
        // Sort by newest actual creation timestamp, fetching latest 6 books
        const data = await fetchBooks({ sort: "newest", limit: 6 });
        setBooks(data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load new arrivals:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNewArrivals();

    // Revalidate live inventory when books are borrowed or returned
    const handleInventoryChange = () => {
      loadNewArrivals();
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
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* 1. Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div className="flex flex-col space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold px-3 py-1 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Arrivals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Latest Additions to <span className="text-primary">BookNook</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            Explore our 6 newest cataloged physical books ready for loan. Free
            to borrow for all registered readers.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors group self-start sm:self-auto"
        >
          <span>View All Books</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 2. Books Grid: 2 Rows x 3 Columns on Large Screens (6 Newest Books) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-2xl p-8">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            No Books Found
          </h3>
          <p className="text-xs text-muted-foreground">
            Check back later as new books are frequently added.
          </p>
        </div>
      )}

      {/* 3. Bottom CTA Button */}
      <div className="mt-12 sm:mt-14 text-center">
        <Link
          href="/books"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-3 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center",
          )}
        >
          Explore Complete Catalog
        </Link>
      </div>
    </section>
  );
}
