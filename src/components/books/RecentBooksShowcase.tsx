// Complete the RecentBooksShowcase component

"use client";

import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookCard } from "@/components/books/BookCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBooks } from "@/services/read/getBooks";
import type { Book } from "@/types/book";

export function RecentBooksShowcase() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  // Sort by latest createdAt and take first 6 books
  const latestBooks = [...books]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 6);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. সেকশন হেডার */}
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

      {/* 2. শেষ ৬টি বই .slice(-6).map() করে প্রদর্শন */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading books...
        </div>
      ) : latestBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {latestBooks.map((book) => (
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

      {/* 3. অল বুকস বাটন */}
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
