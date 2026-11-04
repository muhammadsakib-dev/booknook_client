// OK
"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { CartItem } from "@/providers/cart-provider";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemove: (bookId: string) => void;
}

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const { book, quantity } = item;

  const rawImage =
    (book.image as string) || (book as { imageUrl?: string }).imageUrl;

  const [imgSrc, setImgSrc] = useState(rawImage || undefined || DEFAULT_COVER);

  return (
    <div className="flex items-center gap-3.5 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors shadow-2xs">
      {/* Book Thumbnail */}
      <div className="relative w-14 h-20 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/60 aspect-3/4">
        <Image
          src={imgSrc}
          alt={book.title || "Book cover"}
          fill
          sizes="56px"
          unoptimized
          onError={() => setImgSrc(DEFAULT_COVER)}
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
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            {book.availableCopies} Available
          </span>

          {/* Stepper */}
          <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
            <button
              type="button"
              onClick={() => onUpdateQuantity(book.id, quantity - 1)}
              className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={`Decrease copies of ${book.title}`}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2.5 text-xs font-bold text-foreground select-none">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= book.availableCopies}
              onClick={() => onUpdateQuantity(book.id, quantity + 1)}
              className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label={`Increase copies of ${book.title}`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(book.id)}
        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md cursor-pointer self-start"
        aria-label={`Remove ${book.title} from borrow bag`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
