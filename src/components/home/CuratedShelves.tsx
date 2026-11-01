import {
  ArrowRight,
  Atom,
  Bookmark,
  Brain,
  Compass,
  Cpu,
  Landmark,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ShelfItem {
  id: string;
  category: string;
  title: string;
  description: string;
  approxCopies: string;
  accentClass: string;
  badgeClass: string;
  icon: typeof Bookmark;
}

const SHELVES: ShelfItem[] = [
  {
    id: "fiction",
    category: "Fiction",
    title: "Literary Fiction & Novels",
    description:
      "Epoch-defining narratives, intimate character journeys, and contemporary masterpieces bound for physical reading.",
    approxCopies: "35+ Available",
    accentClass: "group-hover:border-primary/50 group-hover:bg-primary/5",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    icon: Bookmark,
  },
  {
    id: "science",
    category: "Science",
    title: "Scientific Horizons",
    description:
      "Cosmology, evolutionary biology, theoretical physics, and the empirical wonders shaping our universe.",
    approxCopies: "24+ Available",
    accentClass: "group-hover:border-sky-500/50 group-hover:bg-sky-500/5",
    badgeClass:
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    icon: Atom,
  },
  {
    id: "history",
    category: "History",
    title: "Historical Chronicles",
    description:
      "Ancient empires, eyewitness wartime memoirs, and archival analyses of humanity's pivotal turning points.",
    approxCopies: "28+ Available",
    accentClass: "group-hover:border-accent/50 group-hover:bg-accent/5",
    badgeClass: "bg-accent/15 text-accent-foreground border-accent/30",
    icon: Landmark,
  },
  {
    id: "philosophy",
    category: "Philosophy",
    title: "Philosophy & Human Thought",
    description:
      "Classical ethics, metaphysics, existential dialogues, and enduring inquiries into morality and consciousness.",
    approxCopies: "18+ Available",
    accentClass: "group-hover:border-purple-500/50 group-hover:bg-purple-500/5",
    badgeClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    icon: Brain,
  },
  {
    id: "technology",
    category: "Technology",
    title: "Computing & Digital Systems",
    description:
      "System design architecture, algorithmic theory, cybersecurity, and thoughtful perspectives on machine intelligence.",
    approxCopies: "26+ Available",
    accentClass:
      "group-hover:border-emerald-600/50 group-hover:bg-emerald-600/5",
    badgeClass:
      "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/20",
    icon: Cpu,
  },
  {
    id: "children",
    category: "Children",
    title: "Young Minds & Illustrated Tales",
    description:
      "Wonder-filled storybooks, illustrated fables, and gentle foundational primers designed to kindle lifelong curiosity.",
    approxCopies: "19+ Available",
    accentClass: "group-hover:border-amber-500/50 group-hover:bg-amber-500/5",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: Sparkles,
  },
];

export function CuratedShelves() {
  return (
    <section
      aria-labelledby="curated-shelves-heading"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary-hover">
                <span>Explore This Shelf</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
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
