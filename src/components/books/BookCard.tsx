"use client";

import { cn } from "cn";
import { BookMarked, Check, Eye, Layers, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { type Book, normalizeBook } from "@/types/book";

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
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
        "group relative flex flex-col bg-card text-card-foreground rounded-2xl border border-border overflow-hidden shadow-2xs hover:shadow-xl hover:border-primary/40 transition-all duration-300",
        !item.isAvailable && "opacity-90",
        className,
      )}
    >
      {/* 1. Cover Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/60">
        <Image
          src={item.image}
          alt={item.title}
          fill
          unoptimized
          className={cn(
            "object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out",
            !item.isAvailable && "grayscale-30",
          )}
        />

        {/* Gradient Overlay for badge contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/35 pointer-events-none" />

        {/* Top Badges: Category & Rating */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <Badge
            variant="default"
            className="bg-primary/95 text-primary-foreground font-semibold text-[11px] px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-xs"
          >
            {item.category}
          </Badge>

          {item.rating > 0 && (
            <div className="flex items-center gap-1 bg-black/70 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-xs">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <span className="text-white text-[11px]">{item.rating}</span>
            </div>
          )}
        </div>

        {/* Bottom Copies Pill on Image */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md",
              item.isAvailable
                ? "bg-black/75 text-emerald-300 border border-emerald-500/30"
                : "bg-black/75 text-rose-300 border border-rose-500/30",
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                item.isAvailable
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-rose-400",
              )}
            />
            <span>
              {item.isAvailable
                ? `${item.availableCopies} Copies Available`
                : "All Copies Borrowed"}
            </span>
          </div>
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 p-4 z-20">
          <Link
            href={`/books/${item.id}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background text-foreground hover:bg-primary hover:text-primary-foreground shadow-lg transition-all transform translate-y-3 group-hover:translate-y-0 cursor-pointer"
            aria-label={`View details for ${item.title}`}
          >
            <Eye className="w-4 h-4" />
          </Link>

          {item.isAvailable && (
            <button
              type="button"
              onClick={handleBorrow}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg transition-all transform translate-y-3 group-hover:translate-y-0 cursor-pointer"
              aria-label={`Borrow ${item.title}`}
            >
              {isAdded ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <BookMarked className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. Book Info Section */}
      <div className="flex flex-col flex-1 p-5">
        {/* Author */}
        <p className="text-xs font-medium text-muted-foreground mb-1 line-clamp-1">
          By{" "}
          <span className="text-foreground/90 font-semibold">
            {item.author}
          </span>
        </p>

        {/* Title */}
        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
          <Link href={`/books/${item.id}`}>{item.title}</Link>
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
          {item.description}
        </p>

        {/* Footer: Copies count & Borrow Button */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-3 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3 text-primary" />
              Copies
            </span>
            <span
              className={cn(
                "text-sm font-bold",
                item.isAvailable
                  ? "text-foreground"
                  : "text-muted-foreground line-through",
              )}
            >
              {item.availableCopies} of {item.totalCopies} Left
            </span>
          </div>

          <Button
            size="sm"
            type="button"
            disabled={!item.isAvailable}
            onClick={handleBorrow}
            className={cn(
              "text-xs font-semibold px-4 h-9 rounded-xl shadow-2xs transition-all flex items-center gap-1.5",
              !item.isAvailable
                ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
                : isAdded
                  ? "bg-success text-success-foreground hover:bg-success"
                  : "bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer",
            )}
          >
            {!item.isAvailable ? (
              <span>All Borrowed</span>
            ) : isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <BookMarked className="w-3.5 h-3.5 stroke-[2]" />
                <span>Borrow</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
