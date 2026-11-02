// Complete the CuratedShelves component

import { ArrowRight, Bookmark, Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SHELVES } from "../../../public/data/curated_data";

export function CuratedShelves() {
  return (
    <section
      aria-labelledby="curated-shelves-heading"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 "
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div className="flex flex-col space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold px-3 py-1 rounded-full w-fit">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Library Shelves</span>
          </div>
          <h2
            id="curated-shelves-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground"
          >
            Browse by <span className="text-primary">Literary Journey</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Our physical collection is carefully arranged into specialized
            reading departments. Pick a shelf to discover available copies ready
            for 14-day loan.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors group self-start sm:self-auto"
        >
          <span>All Categories</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Shelves Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-sm:text-center">
        {SHELVES.map((shelf) => {
          const Icon = shelf.icon;
          return (
            <Link
              key={shelf.id}
              href={`/books?category=${encodeURIComponent(shelf.category)}`}
              className={cn(
                "group relative bg-card border border-border rounded-2xl p-6 transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-md flex flex-col justify-between",
                shelf.accentClass,
              )}
            >
              <div>
                {/* Header row with Icon and copy count badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                      shelf.badgeClass,
                    )}
                  >
                    {shelf.approxCopies}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {shelf.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {shelf.description}
                </p>
              </div>

              {/* Bottom Explore Link */}
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary-hover max-sm:justify-center ">
                <span>Explore This Shelf</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 max-sm:hidden" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Editorial Curator Quote Banner */}
      <div className="mt-10 sm:mt-12 bg-surface-subtle border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0 mt-0.5">
            <Bookmark className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-medium text-foreground italic leading-relaxed">
              &ldquo;A physical book borrowed from a neighbor carries not just
              the author&rsquo;s mind, but the quiet reverence of every reader
              who turned the pages before you.&rdquo;
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              — The BookNook Community Library Manifesto
            </p>
          </div>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs hover:bg-primary-hover transition-colors shrink-0 cursor-pointer"
        >
          Start Borrowing Today
        </Link>
      </div>
    </section>
  );
}
