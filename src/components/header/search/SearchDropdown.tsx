// Search results dropdown container

import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import type { NormalizedBook } from "@/types/book";
import { SearchEmptyView } from "./SearchEmptyView";
import { SearchResultItem } from "./SearchResultItem";

interface SearchDropdownProps {
  query: string;
  isLoading: boolean;
  results: NormalizedBook[];
  selectedIndex: number;
  onSelectBook: (id: string) => void;
  onHoverIndex: (index: number) => void;
  onSearchAll: () => void;
}

export function SearchDropdown({
  query,
  isLoading,
  results,
  selectedIndex,
  onSelectBook,
  onHoverIndex,
  onSearchAll,
}: SearchDropdownProps) {
  return (
    <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Searching library...</span>
        </div>
      ) : results.length > 0 ? (
        <div className="flex flex-col">
          {/* Dropdown header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border/60 bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              Related Books ({results.length})
            </span>
            <span className="text-[10px] lowercase text-muted-foreground/70 hidden sm:inline">
              use ↑↓ to navigate, Enter to view
            </span>
          </div>

          {/* Book list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/40 scrollbar-thin flex flex-col">
            {results.map((book, idx) => (
              <SearchResultItem
                key={book.id}
                book={book}
                isSelected={selectedIndex === idx}
                onSelect={onSelectBook}
                onMouseEnter={() => onHoverIndex(idx)}
              />
            ))}
          </div>

          {/* View all footer */}
          <button
            type="button"
            onClick={onSearchAll}
            className="flex items-center justify-between px-5 py-3 border-t border-border/60 bg-muted/20 hover:bg-muted/60 text-xs font-semibold text-primary transition-colors cursor-pointer"
          >
            <span>See all results for &quot;{query.trim()}&quot;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <SearchEmptyView query={query} />
      )}
    </div>
  );
}
