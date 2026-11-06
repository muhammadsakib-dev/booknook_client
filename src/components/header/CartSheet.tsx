// OK
"use client";

import { AlertCircle, BookBookmark, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { toast } from "@/components/ui/sonner";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { createBorrow } from "@/services/create/createBorrow";
import { CartEmptyView } from "./cart/CartEmptyView";
import { CartFooter } from "./cart/CartFooter";
import { CartItemCard } from "./cart/CartItemCard";
import { CartSuccessView } from "./cart/CartSuccessView";

export function CartSheet() {
  const { data: session } = useSession();
  const { items, removeFromCart, updateQuantity, clearCart, totalCount } =
    useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Due date: 14 calendar days from today
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const formattedDueDate = dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Confirm Borrow Handler
  const handleConfirmBorrow = async () => {
    if (isSubmitting) return;

    setErrorMessage(null);

    // Require active session
    if (!session?.user) {
      const msg =
        "You must be signed in to borrow books. Please log in to complete your borrow request.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutPayload = items.map((item) => ({
        bookId: item.book.id,
        quantity: item.quantity,
      }));

      const result = await createBorrow(checkoutPayload);

      if (result.success) {
        setIsSuccess(true);
        clearCart();
        toast.success(
          "Borrow request placed successfully! Awaiting contributor approval.",
        );
      } else {
        const errorText =
          result.message || "Failed to complete book borrow request.";
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch (err) {
      const errorText =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during borrowing.";
      setErrorMessage(errorText);
      toast.error(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (bookId: string) => {
    const item = items.find((i) => i.book.id === bookId);
    removeFromCart(bookId);
    toast.info(
      item?.book.title
        ? `"${item.book.title}" removed from bag.`
        : "Book removed from bag.",
    );
  };

  const handleClearBag = () => {
    clearCart();
    toast.info("Borrow bag cleared.");
  };

  return (
    <Sheet>
      {/* 1. Sheet Trigger */}
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
                className="h-6 w-auto max-sm:h-5 max-md:h-6"
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

      {/* 2. Sheet Drawer Content */}
      <SheetContent
        side="right"
        className="p-6 flex flex-col justify-between w-full sm:max-w-md overflow-hidden bg-card"
      >
        {/* Drawer Header */}
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

        {/* Drawer Body */}
        {isSuccess ? (
          <CartSuccessView
            dueDate={formattedDueDate}
            onClose={() => setIsSuccess(false)}
          />
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
            {/* Error Message */}
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
                        nativeButton={false}
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

            {/* Empty or Items */}
            {items.length === 0 ? (
              <CartEmptyView />
            ) : (
              items.map((item) => (
                <CartItemCard
                  key={item.book.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))
            )}
          </div>
        )}

        {/* Drawer Footer */}
        {!isSuccess && items.length > 0 && (
          <CartFooter
            totalCount={totalCount}
            dueDate={formattedDueDate}
            isSubmitting={isSubmitting}
            onClear={handleClearBag}
            onConfirm={handleConfirmBorrow}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
