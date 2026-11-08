// Ready
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_BOOK_COVER =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

interface BorrowBookThumbnailProps {
  src?: string | null;
  alt: string;
}

export function BorrowBookThumbnail({ src, alt }: BorrowBookThumbnailProps) {
  const initial =
    src && typeof src === "string" && src.trim() !== ""
      ? src.trim()
      : DEFAULT_BOOK_COVER;
  const [imgSrc, setImgSrc] = useState(initial);

  useEffect(() => {
    if (src && typeof src === "string" && src.trim() !== "") {
      setImgSrc(src.trim());
    } else {
      setImgSrc(DEFAULT_BOOK_COVER);
    }
  }, [src]);

  return (
    <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/60 shadow-2xs relative aspect-3/4">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 48px, 56px"
        unoptimized
        onError={() => setImgSrc(DEFAULT_BOOK_COVER)}
        className="object-cover"
      />
    </div>
  );
}
