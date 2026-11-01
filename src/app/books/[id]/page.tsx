"use client";

import { cn } from "cn";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Globe,
  Heart,
  Layers,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookCard } from "@/components/books/BookCard";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { fetchBookById, fetchBooks } from "@/lib/books";
import { type Book, normalizeBook } from "@/types/book";

const STAR_KEYS = ["star-1", "star-2", "star-3", "star-4", "star-5"];

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = (params?.id as string) || "";

  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadBookData() {
      if (!bookId) return;
      try {
        const [bookData, allBooks] = await Promise.all([
          fetchBookById(bookId),
          fetchBooks(),
        ]);

        setBook(bookData);

        // Related books: prioritize same category, exclude current book
        if (allBooks && allBooks.length > 0) {
          const others = allBooks.filter((b) => b._id !== bookId);
          const sameCategory = others.filter(
            (b) =>
              bookData?.category &&
              b.category?.toLowerCase() === bookData.category.toLowerCase(),
          );
          const related = (
            sameCategory.length > 0 ? sameCategory : others
          ).slice(0, 3);
          setRelatedBooks(related);
        }
      } catch (err) {
        console.error("Error loading book details:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadBookData();
    setQuantity(1);
    setIsAdded(false);

    // Listen for inventory updates
    const handleInventoryChange = () => {
      loadBookData();
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
  }, [bookId]);

  // Formatted 14-day loan return deadline
  const returnDeadline = new Date();
  returnDeadline.setDate(returnDeadline.getDate() + 14);
  const formattedReturnDeadline = returnDeadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
          <div className="lg:col-span-5 aspect-[3/4] bg-muted rounded-3xl" />
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="h-6 w-24 bg-muted rounded-full" />
            <div className="h-10 w-3/4 bg-muted rounded-xl" />
            <div className="h-5 w-1/3 bg-muted rounded" />
            <div className="h-8 w-28 bg-muted rounded-lg mt-4" />
            <div className="h-24 w-full bg-muted rounded-xl mt-4" />
            <div className="h-12 w-1/2 bg-muted rounded-xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  // Not Found / Invalid ID state
  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 stroke-[1.5]" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Book Not Found
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          We couldn&apos;t find the book you are looking for. It may have been
          archived or the identifier provided is invalid.
        </p>
        <Link
          href="/books"
          className={cn(
            buttonVariants(),
            "bg-primary hover:bg-primary-hover text-primary-foreground",
          )}
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
        {/* 1. Breadcrumbs & Back Button */}
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

        {/* 2. Main Book Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xs mb-16">
          {/* Left Column: Cover Image & Availability Status */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-border/80 bg-muted">
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

              {/* Status Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge
                  variant="default"
                  className="bg-primary/95 text-primary-foreground font-semibold px-3 py-1 shadow-md text-xs backdrop-blur-xs"
                >
                  {item.category}
                </Badge>
              </div>

              {/* Copies Availability Pill on Cover */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div
                  className={cn(
                    "inline-flex items-center gap-2 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg w-full justify-center",
                    item.isAvailable ? "bg-black/80" : "bg-rose-950/85",
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      item.isAvailable
                        ? "bg-emerald-400 animate-pulse"
                        : "bg-rose-500",
                    )}
                  />
                  <span>
                    {item.isAvailable
                      ? `${item.availableCopies} Copies Available to Borrow`
                      : "Currently All Copies Borrowed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Library Terms */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background/50">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>Verified Physical Copy</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background/50">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>14 Days Loan Duration</span>
              </div>
            </div>
          </div>

          {/* Right Column: Book Information & Borrowing Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category & Rating Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {item.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex items-center text-amber-400">
                    {STAR_KEYS.map((k) => (
                      <Star
                        key={k}
                        className="w-4 h-4 fill-amber-400 stroke-amber-400"
                      />
                    ))}
                  </div>
                  <span className="font-bold text-foreground">
                    {item.rating}
                  </span>
                  <span className="text-muted-foreground">
                    (Catalog Rating)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground mb-2 leading-tight">
                {item.title}
              </h1>

              {/* Author */}
              <p className="text-sm sm:text-base font-medium text-muted-foreground mb-6">
                Written by{" "}
                <span className="text-foreground font-semibold">
                  {item.author}
                </span>
              </p>

              {/* Availability Banner */}
              <div
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border mb-6",
                  item.isAvailable
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base",
                      item.isAvailable
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white",
                    )}
                  >
                    {item.availableCopies}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm sm:text-base">
                      {item.isAvailable
                        ? `${item.availableCopies} of ${item.totalCopies} Copies Available`
                        : "Out of Copies"}
                    </span>
                    <span className="text-xs opacity-80">
                      {item.isAvailable
                        ? `Return deadline: ${formattedReturnDeadline} (14 days)`
                        : "Check back soon when a copy is returned"}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold">
                  <Calendar className="w-4 h-4" />
                  <span>14 Days Loan</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-foreground mb-2">
                  Synopsis & Overview
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Specifications Matrix */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1 mb-1">
                    <Layers className="w-3 h-3 text-primary" />
                    Total Inventory
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {item.totalCopies} Copies
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1 mb-1">
                    <Globe className="w-3 h-3 text-primary" />
                    Language
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    English
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-primary" />
                    Loan Period
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    14 Days
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Copies Selector & Borrow Button */}
            <div className="pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity Controls: Strictly capped at available copies */}
                {item.isAvailable && (
                  <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden h-12 w-fit px-1">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Decrease copies"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-foreground select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= item.availableCopies}
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(item.availableCopies, q + 1),
                        )
                      }
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Increase copies"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Primary Borrow Action Button */}
                <Button
                  size="lg"
                  disabled={!item.isAvailable}
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 h-12 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2",
                    !item.isAvailable
                      ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
                      : isAdded
                        ? "bg-success hover:bg-success text-success-foreground cursor-pointer"
                        : "bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer",
                  )}
                >
                  {!item.isAvailable ? (
                    <span>Currently Unavailable to Borrow</span>
                  ) : isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to Borrow Bag!</span>
                    </>
                  ) : (
                    <>
                      <BookMarked className="w-4 h-4 stroke-[2]" />
                      <span>
                        Borrow {quantity > 1 ? `(${quantity} Copies)` : "Book"}
                      </span>
                    </>
                  )}
                </Button>

                {/* Wishlist Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="h-12 w-12 p-0 rounded-xl cursor-pointer shrink-0"
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isWishlisted
                        ? "fill-rose-500 text-rose-500"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  />
                </Button>

                {/* Share Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: item.title,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="h-12 w-12 p-0 rounded-xl cursor-pointer shrink-0"
                  aria-label="Share Book"
                >
                  <Share2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Related Books Section */}
        {relatedBooks.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  You Might Also <span className="text-primary">Like</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  More books available to borrow from our library collection.
                </p>
              </div>
              <Link
                href="/books"
                className="text-xs sm:text-sm font-semibold text-primary hover:underline"
              >
                View Catalog
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
