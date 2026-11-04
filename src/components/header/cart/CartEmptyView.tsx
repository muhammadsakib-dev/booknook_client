// OK
"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function CartEmptyView() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 stroke-[1.5]" />
      </div>
      <p className="text-base font-semibold text-foreground mb-1">
        Your Borrow Bag is empty.
      </p>
      <p className="text-xs text-muted-foreground mb-6 max-w-xs leading-relaxed">
        Browse available books in our catalog and add them to your Borrow Bag to
        check out for free.
      </p>
      <SheetClose
        nativeButton={false}
        render={
          <Link
            href="/books"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer",
            )}
          >
            Browse Library Catalog
          </Link>
        }
      />
    </div>
  );
}
