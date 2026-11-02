// Complete the BookDetailsPage component

"use client";

import { cn } from "cn";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Check,
  Clock,
  Layers,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookCard } from "@/components/books/BookCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { getBookById } from "@/services/read/getBookById";
import { getBooks } from "@/services/read/getBooks";
import { type Book, normalizeBook } from "@/types/book";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = (params?.id as string) || "";

  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      if (!bookId) return;
      try {
        const [bookData, allBooks] = await Promise.all([
          getBookById(bookId),
          getBooks(),
        ]);

        setBook(bookData);

        if (allBooks && allBooks.length > 0) {
          const others = allBooks.filter((b) => b._id !== bookId);
          const sameCategory = others.filter(
            (b) =>
              bookData?.category &&
              b.category?.toLowerCase() === bookData.category.toLowerCase(),
          );
          setRelatedBooks(
            (sameCategory.length > 0 ? sameCategory : others).slice(0, 3),
          );
        }
      } catch (err) {
        console.error("Error loading book details:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 stroke-[1.5]" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Book Not Found
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          We couldn&apos;t find the book you are looking for. It may have been
          removed from the catalog.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const item = normalizeBook(book);

  const handleAddToCart = () => {
    if (!item.isAvailable || item.availableCopies <= 0) return;
    const ok = addToCart(item, quantity);
    if (ok !== false) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. নেভিগেশন ও ব্যাক বাটন */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <nav className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/books"
              className="hover:text-primary transition-colors"
            >
              Books
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {item.title}
            </span>
          </nav>
        </div>

        {/* 2. মূল বইয়ের বিস্তারিত সেকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xs mb-16">
          {/* বামে: কভার ইমেজ */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-border bg-muted">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                priority
                className={cn(
                  "object-cover object-center",
                  !item.isAvailable && "grayscale-30",
                )}
              />
            </div>
          </div>

          {/* ডানে: তথ্যাবলী ও অ্যাকশন বাটন */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* ক্যাটাগরি ও রেটিং */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary font-semibold text-xs px-3 py-1 rounded-md"
                >
                  {item.category}
                </Badge>

                {item.rating > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    <span>{item.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      / 5.0
                    </span>
                  </div>
                )}
              </div>

              {/* টাইটেল */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-2 leading-tight">
                {item.title}
              </h1>

              {/* লেখক */}
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                By{" "}
                <span className="font-semibold text-foreground">
                  {item.author}
                </span>
              </p>

              {/* মেটাডেটা পিলস */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span
                    className={
                      item.isAvailable
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-rose-500 font-semibold"
                    }
                  >
                    {item.isAvailable
                      ? `${item.availableCopies} of ${item.totalCopies} Copies Available`
                      : "Currently All Copies Borrowed"}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>14 Days Loan Duration</span>
                </div>
              </div>

              {/* সারসংক্ষেপ */}
              <div className="mb-8">
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  About This Book
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* পরিমাণ ও ধার নেওয়ার বাটন */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {item.isAvailable && (
                <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden h-11 w-fit px-1">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease copies"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-foreground select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= item.availableCopies}
                    onClick={() =>
                      setQuantity((q) => Math.min(item.availableCopies, q + 1))
                    }
                    className="w-9 h-9 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase copies"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              <Button
                size="lg"
                disabled={!item.isAvailable}
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 h-11 rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2",
                  !item.isAvailable
                    ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
                    : isAdded
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white cursor-pointer"
                      : "bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer",
                )}
              >
                {!item.isAvailable ? (
                  <span>Currently Unavailable</span>
                ) : isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Added to Borrow Bag!</span>
                  </>
                ) : (
                  <>
                    <BookMarked className="w-4 h-4 stroke-2" />
                    <span>
                      Borrow {quantity > 1 ? `(${quantity} Copies)` : "Book"}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 3. রিলেটেড বইয়ের তালিকা */}
        {relatedBooks.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  You Might Also Like
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  More books from our library collection.
                </p>
              </div>
              <Link
                href="/books"
                className="text-xs sm:text-sm font-semibold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedBooks.map((rel) => (
                <BookCard key={rel._id} book={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
