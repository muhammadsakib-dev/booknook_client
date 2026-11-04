// Single search result item

import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { NormalizedBook } from "@/types/book";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

interface SearchResultItemProps {
  book: NormalizedBook;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMouseEnter: () => void;
}

export function SearchResultItem({
  book,
  isSelected,
  onSelect,
  onMouseEnter,
}: SearchResultItemProps) {
  const [imgSrc, setImgSrc] = useState(
    book.image && book.image.trim() !== "" ? book.image : DEFAULT_COVER,
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(book.id)}
      onMouseEnter={onMouseEnter}
      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors cursor-pointer group ${
        isSelected ? "bg-muted" : "hover:bg-muted/60"
      }`}
    >
      <div className="relative w-10 h-14 rounded-xs overflow-hidden shrink-0 border border-border/60 shadow-2xs group-hover:scale-105 transition-transform bg-muted">
        <Image
          src={imgSrc}
          alt={book.title}
          fill
          sizes="40px"
          unoptimized
          onError={() => setImgSrc(DEFAULT_COVER)}
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          by {book.author}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/40">
            {book.category}
          </span>
          <span className="max-sm:hidden flex items-center gap-0.5 text-[11px] font-medium text-amber-600">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            {book.rating}
          </span>
          <span
            className={`text-[10px] font-semibold ml-auto ${
              book.isAvailable ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {book.isAvailable ? "Available" : "Borrowed"}
          </span>
        </div>
      </div>

      <ArrowRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
    </button>
  );
}
