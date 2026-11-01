"use client";

import {
  AlertCircle,
  BookBookmark,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  LogIn,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "@/lib/auth-client";
import { checkoutBorrowBag } from "@/lib/books";
import { cn } from "@/lib/utils";

// Direct localStorage storage key (No Provider needed)
const CART_STORAGE_KEY = "booknook-borrow-cart";

export interface CartBook {
  id: string;
  title: string;
  author: string;
  image: string;
  availableCopies: number;
}

export interface CartItem {
  book: CartBook;
  quantity: number;
}

export function CartSheet() {
  const { data: session } = useSession();

  // 1. Direct State Management (No Provider, No useCart hook)
  const [items, setItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync on initial mount & listen to real-time cart updates
  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error("Failed to read borrow bag from localStorage", e);
      }
    };

    loadCart();

    const handleUpdate = () => loadCart();
    window.addEventListener("booknook:cart-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("booknook:cart-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Helper to persist updates directly into localStorage & notify UI
  const saveCartToStorage = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event("booknook:cart-updated"));
    } catch (e) {
      console.error("Failed to save borrow bag to localStorage", e);
    }
  };

  // Direct simple action functions
  const removeFromCart = (bookId: string) => {
    const updated = items.filter((item) => item.book.id !== bookId);
    saveCartToStorage(updated);
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    const updated = items.map((item) => {
      if (item.book.id === bookId) {
        const safeQty = Math.min(quantity, item.book.availableCopies);
        return { ...item, quantity: safeQty };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Due date: exactly 14 calendar days from today
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const formattedDueDate = dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleConfirmBorrow = async () => {
    if (items.length === 0 || isSubmitting) return;

    setErrorMessage(null);

    // Authentication Guard: require active session
    if (!session?.user) {
      setErrorMessage(
        "You must be signed in to borrow books. Please log in to complete your borrow request.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Send complete batch payload to POST /borrows
      const checkoutPayload = items.map((item) => ({
        bookId: item.book.id,
        quantity: item.quantity,
      }));

      const result = await checkoutBorrowBag(checkoutPayload);

      if (result.success) {
        setIsSuccess(true);
        clearCart();
      } else {
        // Business failure: preserve items in bag and display actual error
        setErrorMessage(
          result.message || "Failed to complete book borrow request.",
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during borrowing.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      {/* Sheet Trigger - Start */}
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            type="button"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors h-11 w-auto px-2.5 rounded-xl select-none cursor-pointer"
          >
            <div className="relative flex items-center">
              <Image
                src="/book-bookmark.png"
                alt="Borrow Bag"
                width={360}
                height={360}
                className="h-6 w-auto max-sm:h-5 max-sm:w-auto max-md:h-6 max-md:w-auto"
              />
              <Badge
                variant="default"
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center p-0"
              >
                {totalCount}
              </Badge>
            </div>
            <span className="max-lg:hidden font-semibold tracking-tight">
              Borrow Bag
            </span>
          </Button>
        }
      />
      {/* Sheet Trigger - End */}

      <SheetContent
        side="right"
        className="p-6 flex flex-col justify-between w-full sm:max-w-md overflow-hidden bg-card"
      >
        {/* 1. Drawer Header */}
        <SheetHeader className="p-0 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookBookmark className="w-5 h-5 text-primary" />
              <SheetTitle className="text-lg font-bold text-foreground">
                Borrow Bag
              </SheetTitle>
            </div>
            {items.length > 0 && (
              <Badge variant="outline" className="text-xs font-semibold">
                {totalCount} {totalCount === 1 ? "Book" : "Books"} Selected
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* 2. Success Message when Borrow confirmed */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 px-2 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-2" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Borrowing Confirmed!
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Your physical book borrowing request has been approved and
              recorded. Copies must be returned by{" "}
              <strong className="text-foreground">{formattedDueDate}</strong>.
            </p>
            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              <SheetClose
                render={
                  <Link
                    href="/my-borrows"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer",
                    )}
                  >
                    View in My Borrows
                  </Link>
                }
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsSuccess(false)}
                className="w-full text-xs cursor-pointer"
              >
                Close Drawer
              </Button>
            </div>
          </div>
        ) : (
          /* 3. Selected Books List */
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
            {/* Error Banner if borrow failed */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block mb-0.5">
                    Borrow Request Notice
                  </span>
                  <span>{errorMessage}</span>
                  {!session?.user && (
                    <div className="mt-2.5">
                      <SheetClose
                        render={
                          <Link
                            href="/login?redirect=/books"
                            className={cn(
                              buttonVariants({ size: "xs" }),
                              "bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold inline-flex items-center",
                            )}
                          >
                            <LogIn className="w-3 h-3 mr-1" />
                            Sign In to Borrow
                          </Link>
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-16 h-16 rounded-full bg-primary-subtle text-primary flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 stroke-[1.5]" />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">
                  Your Borrow Bag is empty.
                </p>
                <p className="text-xs text-muted-foreground mb-6 max-w-xs leading-relaxed">
                  Browse available books in our catalog and add them to your
                  Borrow Bag to check out for free.
                </p>
                <SheetClose
                  render={
                    <Link
                      href="/books"
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer",
                      )}
                    >
                      Browse Library Catalog
                    </Link>
                  }
                />
              </div>
            ) : (
              items.map(({ book, quantity }) => (
                <div
                  key={book.id}
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors shadow-2xs"
                >
                  {/* Book Cover Thumbnail */}
                  <div className="relative w-14 h-20 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/60">
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground line-clamp-1">
                      {book.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      by {book.author}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Available copies indicator */}
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {book.availableCopies} Available
                      </span>

                      {/* Requested Copies Stepper */}
                      <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(book.id, quantity - 1)}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          aria-label={`Decrease requested copies of ${book.title}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-foreground select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          disabled={quantity >= book.availableCopies}
                          onClick={() => updateQuantity(book.id, quantity + 1)}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label={`Increase requested copies of ${book.title}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(book.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md cursor-pointer self-start"
                    aria-label={`Remove ${book.title} from borrow bag`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. Drawer Footer: Expected Return Date & Confirm Borrowing */}
        {!isSuccess && items.length > 0 && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Expected Return Date:
              </span>
              <span className="font-bold text-foreground flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" />
                {formattedDueDate} (14 Days)
              </span>
            </div>

            <div className="flex gap-2.5">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={isSubmitting}
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive cursor-pointer h-10 px-3"
                aria-label="Clear all books from borrow bag"
              >
                Clear Bag
              </Button>
              <Button
                size="sm"
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBorrow}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground font-bold cursor-pointer h-10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    <span>Confirming Borrow...</span>
                  </>
                ) : (
                  <span>
                    Confirm Borrowing ({totalCount}{" "}
                    {totalCount === 1 ? "Book" : "Books"})
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
