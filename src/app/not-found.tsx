// Complete 404 Not Found Page

import { ArrowLeft, BookX, Home } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-lg text-center flex flex-col items-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
          <BookX className="w-8 h-8 stroke-[2]" />
        </div>

        {/* 404 Badge */}
        <span className="text-xs font-bold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10 mb-3">
          Error 404
        </span>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-8">
          The page or book shelf you are looking for doesn&apos;t exist or has
          been moved from our library catalog.
        </p>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "default" }),
              "w-full bg-primary text-primary-foreground hover:bg-primary-hover font-semibold h-11 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2",
            )}
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/books"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full border-border hover:bg-muted font-semibold h-11 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2",
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
