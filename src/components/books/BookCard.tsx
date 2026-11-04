// Complete the BookCard component

"use client";

import { cn } from "cn";
import { BookMarked, Check, Eye, Layers, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { type Book, normalizeBook } from "@/types/book";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const item = normalizeBook(book);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleBorrow = () => {
    if (!item.isAvailable) return;
    const ok = addToCart(item);
    if (ok !== false) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1600);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-card text-card-foreground rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300",
        !item.isAvailable && "opacity-90",
      )}
    >
      {/* 1. Cover Image Section (Clean, Unobscured Book Cover) */}
      <div className="relative w-full h-64 bg-muted/30 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-36 h-52 rounded-lg overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
          <Image
            src={item.image}
            alt={item.title}
            fill
            unoptimized
            className={cn("object-cover", !item.isAvailable && "grayscale-30")}
          />
        </div>

        {/* Hover Quick View Link */}
        <Link
          href={`/books/${item.id}`}
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10"
          aria-label={`View details for ${item.title}`}
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-background/95 text-foreground text-xs font-semibold shadow-md backdrop-blur-xs hover:bg-primary hover:text-primary-foreground transition-colors">
            <Eye className="w-3.5 h-3.5" />
            View Details
          </span>
        </Link>
      </div>

      {/* 2. Book Info Section (Rating, Category, and Details Outside Image) */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category & Rating Row (Outside of Image) */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary font-semibold text-[11px] px-2.5 py-0.5 rounded-md"
          >
            {item.category}
          </Badge>

          {item.rating > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors  mb-1 max-sm:text-wrap">
          <Link href={`/books/${item.id}`}>{item.title}</Link>
        </h3>

        {/* Author */}
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
          By{" "}
          <span className="font-semibold text-foreground/90">
            {item.author}
          </span>
        </p>

        {/* Description snippet */}
        <p className="max-sm:hidden text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
          {item.description}
        </p>

        {/* Footer: Copies Count & Borrow Action */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-3 mt-auto max-sm:flex-col max-sm:items-center max-sm:gap-2">
          <div className="flex flex-col max-sm:flex-row max-sm:items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3 text-primary" />
              Copies
            </span>
            <span
              className={cn(
                "text-xs font-bold",
                item.isAvailable
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-500 line-through",
              )}
            >
              {item.isAvailable
                ? `${item.availableCopies} of ${item.totalCopies} Available`
                : "All Borrowed"}
            </span>
          </div>

          <Button
            size="sm"
            type="button"
            disabled={!item.isAvailable}
            onClick={handleBorrow}
            className={cn(
              "text-xs font-semibold px-3.5 h-8.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 max-sm:w-full max-sm:justify-center",
              !item.isAvailable
                ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
                : isAdded
                  ? "bg-emerald-600 text-white hover:bg-emerald-600"
                  : "bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer",
            )}
          >
            {!item.isAvailable ? (
              <span>Unavailable</span>
            ) : isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <BookMarked className="w-3.5 h-3.5 stroke-2" />
                <span>Borrow</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
